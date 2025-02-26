import { PrismaService } from 'nestjs-prisma'
import {
  PrismaClient,
  Prisma,
  QuotationStatus,
  ProjectStatus
} from '.prisma/client'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { quotationDetailSelect, quotationSelect } from 'responses'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import { paginate } from 'utils/helper'
import {
  CreateQuotationDto,
  DeleteManyQuotationDto,
  FindManyQuotationDto,
  UpdateQuotationDto
} from './dto/quotation.dto'

@Injectable()
export class QuotationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async createMyQuotation(data: CreateQuotationDto, userId: string) {
    return this.prisma.quotation.create({
      data: {
        name: data.name,
        desc: data.desc,
        projectId: data.projectId,
        status: QuotationStatus.PENDING,
        items: {
          create: data.items?.map(item => ({
            unit: item.unit,
            price: item.price,
            quantity: item.quantity,
            ...(item.projectItemId && {
              projectItem: {
                connect: {
                  id: item.projectItemId
                }
              }
            }),
            attachedFiles: {
              connect: item.attachedFileIds?.map(id => ({ id }))
            },
            productQuotation: {
              create: {
                name: item.productQuotation.name,
                thumb: item.productQuotation.thumb,
                desc: item.productQuotation.desc,
                productAttributes: {
                  create: item.productQuotation?.productAttributes?.map(
                    attr => ({
                      key: attr.key,
                      value: attr.value
                    })
                  )
                }
              }
            }
          }))
        },
        creatorId: userId
      },
      include: {
        items: {
          include: {
            attachedFiles: true,
            productQuotation: {
              include: {
                productAttributes: true,
                quotationItems: true
              }
            }
          }
        }
      }
    })
  }

  async updateMyQuotations(
    id: string,
    data: UpdateQuotationDto,
    userId: string
  ) {
    const quotation = await this.prisma.quotation.findFirstOrThrow({
      where: { id },
      include: {
        items: {
          include: {
            attachedFiles: true,
            productQuotation: {
              include: {
                productAttributes: true,
                quotationItems: true
              }
            }
          }
        },
        project: {
          select: {
            status: true
          }
        }
      }
    })

    if (!quotation.isEditable)
      throw new HttpException(
        'Báo giá không thể điều chỉnh ở trạng thái hiện tại!',
        HttpStatus.CONFLICT
      )

    this.validateProjectStatus(
      quotation.project.status,
      ['CANCELED', 'COMPLETED'],
      'cập nhật'
    )

    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      await prisma.quotationHistory.create({
        data: {
          quotationCapture: quotation,
          quotationId: id
        }
      })

      if (data.items)
        await prisma.quotationItem.deleteMany({ where: { quotationId: id } })

      return prisma.quotation.update({
        where: { id },
        data: {
          name: data.name,
          desc: data.desc,
          isEditable: false,
          items: {
            create: data.items?.map(item => ({
              unit: item.unit,
              quantity: item.quantity,
              price: item.price,
              ...(item.projectItemId && {
                projectItem: {
                  connect: {
                    id: item.projectItemId
                  }
                }
              }),
              attachedFiles: {
                connect: item.attachedFileIds?.map(id => ({ id }))
              },
              productQuotation: {
                create: {
                  name: item.productQuotation.name,
                  thumb: item.productQuotation.thumb,
                  desc: item.productQuotation.desc,
                  productAttributes: {
                    create: item.productQuotation?.productAttributes?.map(
                      attr => ({
                        key: attr.key,
                        value: attr.value
                      })
                    )
                  }
                }
              }
            }))
          },
          updaterId: userId
        },
        include: {
          items: {
            include: {
              attachedFiles: true,
              productQuotation: {
                include: {
                  productAttributes: true,
                  quotationItems: true
                }
              }
            }
          }
        }
      })
    })
  }

  checkQuotationIsEditable(quotation: { isEditable: boolean }) {
    if (!quotation.isEditable) {
      throw new HttpException(
        'Báo giá không thể điều chỉnh hoặc xóa ở trạng thái hiện tại!',
        HttpStatus.CONFLICT
      )
    }
  }

  async findManyQuotationInMyProjects(
    data: FindManyQuotationDto,
    userId: string
  ) {
    const {
      page,
      perPage,
      keyword,
      orderKey,
      orderValue,
      statuses,
      projectId
    } = data

    const keySearch = ['name', 'desc']

    const where: Prisma.QuotationWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      ...(statuses && {
        status: {
          in: statuses
        }
      }),
      ...(projectId && { projectId }),
      creatorId: userId
    }

    return await paginate(
      this.prisma.quotation,
      {
        where,
        select: quotationSelect,
        orderBy: {
          [orderKey]: orderValue
        }
      },
      {
        page,
        perPage
      }
    )
  }

  async findOneMyQuotation(id: string, userId: string) {
    return this.prisma.quotation.findUniqueOrThrow({
      where: { id, creatorId: userId },
      select: quotationDetailSelect
    })
  }

  async deleteManyMyQuotations(data: DeleteManyQuotationDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const quotations = await prisma.quotation.findMany({
        where: {
          id: { in: data.ids },
          creatorId: userId
        }
      })

      quotations.forEach(quotation =>
        this.validateQuotationStatus(quotation.status, ['PENDING'], 'xóa')
      )

      const dataProject: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Quotation',
        include: {
          quotationHistories: true,
          items: {
            include: {
              attachedFiles: true,
              productQuotation: {
                include: {
                  productAttributes: true,
                  quotationItems: true
                }
              }
            }
          }
        }
      }

      await this.trashService.createMany(dataProject, prisma)

      return prisma.quotation.deleteMany({
        where: {
          id: {
            in: data.ids
          },
          creatorId: userId
        }
      })
    })
  }

  async deleteMyQuotation(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const quotation = await prisma.quotation.findUnique({
        where: { id, creatorId: userId }
      })

      this.validateQuotationStatus(quotation.status, ['PENDING'], 'xóa')

      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Quotation',
        include: {
          quotationHistories: true,
          items: {
            include: {
              attachedFiles: true,
              productQuotation: {
                include: {
                  productAttributes: true,
                  quotationItems: true
                }
              }
            }
          }
        }
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.quotation.delete({
        where: { id, creatorId: userId },
        include: {
          items: true
        }
      })
    })
  }

  async approveQuoteInMyProject(quotationId: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const quotation = await this.prisma.quotation.findUniqueOrThrow({
        where: {
          id: quotationId,
          creatorId: userId
        },
        include: {
          project: true
        }
      })

      this.validateProjectStatus(
        quotation.project.status,
        ['APPROVED'],
        'duyệt'
      )

      this.validateQuotationStatus(
        quotation.status,
        ['PENDING', 'CANCELED'],
        'duyệt'
      )

      const updateProjectStatus = prisma.project.update({
        where: { id: quotation.project.id },
        data: {
          status: ProjectStatus.QUOTED,
          updaterId: userId
        }
      })

      const cancelQuotationApproved = prisma.quotation.updateMany({
        where: {
          projectId: quotation.project.id,
          status: QuotationStatus.APPROVED
        },
        data: {
          status: QuotationStatus.CANCELED,
          updaterId: userId
        }
      })

      const approveQuotation = prisma.quotation.update({
        where: {
          id: quotationId
        },
        data: {
          status: QuotationStatus.APPROVED,
          updaterId: userId
        }
      })

      await Promise.all([
        updateProjectStatus,
        approveQuotation,
        cancelQuotationApproved
      ])

      return approveQuotation
    })
  }

  async validateProjectStatus(
    status: ProjectStatus,
    validStatuses: ProjectStatus[],
    action: string
  ) {
    if (!validStatuses.includes(status)) {
      throw new HttpException(
        `Không thể ${action} báo giá ở trạng thái báo hiện tại.`,
        HttpStatus.CONFLICT
      )
    }
  }

  async validateQuotationStatus(
    status: QuotationStatus,
    validStatuses: QuotationStatus[],
    action: string
  ) {
    if (!validStatuses.includes(status)) {
      throw new HttpException(
        `Không thể ${action} báo giá ở trạng thái hiện tại.`,
        HttpStatus.CONFLICT
      )
    }
  }

  async requestEdit(quotationId: string, userId: string) {
    const quotation = await this.prisma.quotation.findUniqueOrThrow({
      where: {
        id: quotationId,
        creatorId: userId
      },
      include: {
        project: true
      }
    })

    this.validateProjectStatus(
      quotation.project.status,
      ['PENDING', 'APPROVED', 'QUOTED'],
      'yêu cầu chỉnh sửa'
    )

    this.validateQuotationStatus(
      quotation.status,
      ['PENDING', 'CANCELED'],
      'yêu cầu chỉnh sửa'
    )

    return this.prisma.quotation.update({
      where: {
        id: quotationId
      },
      data: {
        isEditable: true,
        updaterId: userId
      }
    })
  }

  async getHistories(quotationId: string, userId: string) {
    return this.prisma.quotationHistory.findMany({
      where: {
        quotation: {
          id: quotationId,
          creatorId: userId
        }
      }
    })
  }

  async findOneMyQuotationInProject(projectId: string, userId: string) {
    return this.prisma.quotation.findUniqueOrThrow({
      where: {
        creatorId_projectId: {
          creatorId: userId,
          projectId
        }
      },
      select: quotationDetailSelect
    })
  }
}
