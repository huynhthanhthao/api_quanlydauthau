import { Prisma, QuotationStatus } from '@prisma/client'

export const productSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  desc: true,
  updatedAt: true
}

export const productDetailSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  desc: true,
  updatedAt: true
}

export const productQuotationSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  desc: true
}

export const unitSelect: Prisma.UnitSelect = {
  id: true,
  name: true,
  code: true,
  desc: true,
  updatedAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const projectSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  price: true,
  updatedAt: true,
  createdAt: true,
  projectItems: {
    select: {
      id: true,
      productCapture: true,
      quantity: true,
      updatedAt: true,
      unit: true
    }
  },
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const projectDetailSelectByAdmin: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  price: true,
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  },
  quotations: {
    where: {
      status: QuotationStatus.APPROVED
    },
    include: {
      items: {
        include: {
          productQuotation: true
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatar: true,
          company: {
            select: {
              id: true,
              name: true,
              phone: true,
              logo: true
            }
          }
        }
      }
    }
  },
  projectItems: true,
  suppliers: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const publicProjectSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const publicProjectDetailSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  updatedAt: true,
  createdAt: true,
  projectItems: {
    select: {
      id: true,
      productCapture: true,
      quantity: true,
      updatedAt: true,
      unit: true
    }
  },
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const quotationSelect: Prisma.QuotationSelect = {
  id: true,
  name: true,
  desc: true,
  status: true,
  isEditable: true,
  items: {
    select: {
      id: true,
      quantity: true,
      projectItemId: true,
      updatedAt: true,
      unit: true,
      price: true
    }
  },
  project: {
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      status: true,
      updatedAt: true
    }
  },
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const quotationDetailSelect: Prisma.QuotationSelect = {
  id: true,
  name: true,
  desc: true,
  status: true,
  isEditable: true,
  items: {
    select: {
      id: true,
      quantity: true,
      projectItemId: true,
      updatedAt: true,
      unit: true,
      price: true,
      attachedFiles: true,
      productQuotation: true
    }
  },
  project: {
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      status: true,
      updatedAt: true,
      projectItems: true
    }
  },
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const ticketSelect: Prisma.TicketSelect = {
  id: true,
  type: true,
  code: true,
  status: true,
  title: true,
  createdAt: true,
  lastCommentAt: true,
  lastComment: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  },
  assignees: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      email: true
    }
  }
}

export const ticketCommentSelect: Prisma.TicketCommentSelect = {
  id: true,
  content: true,
  createdAt: true,
  ticketId: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const companySelect: Prisma.CompanySelect = {
  id: true,
  name: true,
  address: true,
  email: true,
  phone: true,
  tax: true,
  website: true,
  logo: true,
  representativeName: true,
  representativePosition: true,
  updatedAt: true,
  createdAt: true
}

export const companyDetailSelect: Prisma.CompanySelect = {
  id: true,
  name: true,
  address: true,
  email: true,
  phone: true,
  tax: true,
  website: true,
  logo: true,
  representativeName: true,
  representativePosition: true,
  ward: {
    select: {
      code: true,
      codeName: true,
      name: true,
      district: {
        select: {
          code: true,
          codeName: true,
          shortCodeName: true,
          city: {
            select: {
              code: true,
              name: true,
              phoneCode: true
            }
          }
        }
      }
    }
  },
  updatedAt: true,
  createdAt: true
}

export const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  status: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  updatedAt: true,
  role: {
    select: {
      id: true,
      name: true
    }
  },
  company: {
    select: {
      id: true,
      name: true,
      phone: true,
      logo: true
    }
  }
}

export const userDetailSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  status: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  birthDate: true,
  company: {
    select: {
      id: true,
      name: true,
      phone: true,
      logo: true
    }
  },
  updatedAt: true,
  ward: {
    select: {
      code: true,
      codeName: true,
      name: true,
      district: {
        select: {
          code: true,
          codeName: true,
          shortCodeName: true,
          city: {
            select: {
              code: true,
              name: true,
              phoneCode: true
            }
          }
        }
      }
    }
  },
  role: {
    select: {
      id: true,
      name: true,
      permissions: {
        select: {
          code: true,
          name: true
        }
      }
    }
  }
}

export const userLoginSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  password: true,
  status: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  birthDate: true,
  company: {
    select: {
      id: true,
      name: true,
      phone: true,
      logo: true
    }
  },
  updatedAt: true,
  ward: {
    select: {
      code: true,
      codeName: true,
      name: true,
      district: {
        select: {
          code: true,
          codeName: true,
          shortCodeName: true,
          city: {
            select: {
              code: true,
              name: true,
              phoneCode: true
            }
          }
        }
      }
    }
  },
  role: {
    select: {
      id: true,
      name: true,
      permissions: {
        select: {
          code: true,
          name: true
        }
      }
    }
  }
}

export const permissionGroupSelect: Prisma.PermissionGroupSelect = {
  id: true,
  name: true,
  permissions: true
}

export const roleSelect: Prisma.RoleSelect = {
  id: true,
  name: true,
  permissions: {
    select: {
      code: true,
      name: true
    }
  }
}

export const mediaSelect: Prisma.MediaSelect = {
  id: true,
  name: true,
  path: true,
  createdAt: true
}
