import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const readJsonFile = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return []
  }
}

const roles = [
  {
    name: 'Quản trị',
    permissionIds: []
  },
  {
    name: 'Chủ dự án',
    permissionIds: []
  },
  {
    name: 'Nhà cung cấp',
    permissionIds: []
  }
]

async function main() {
  await prisma.permission.createMany({
    data: []
  })

  await Promise.all(
    roles.map(role =>
      prisma.role.create({
        data: {
          name: role.name,
          permissions: {
            connect: role.permissionIds.map(permissionId => ({
              id: permissionId
            }))
          }
        }
      })
    )
  )

  await prisma.user.create({
    data: {
      name: 'admin',
      password: bcrypt.hashSync('aA@123', 10),
      username: 'admin'
    }
  })

  const provinces = await readJsonFile('jsonData/provinces.json')

  const cityPromises = provinces.map(async province => {
    const city = await prisma.city.create({
      data: {
        code: province.code,
        name: province.name,
        phoneCode: province.phone_code,
        divisionType: province.division_type,
        districts: {
          create: province.districts.map(district => ({
            code: district.code,
            name: district.name,
            codeName: district.codename,
            divisionType: district.division_type,
            shortCodeName: district.short_codename,
            wards: {
              create: district.wards.map(ward => ({
                code: ward.code,
                name: ward.name,
                codeName: ward.codename,
                divisionType: ward.division_type,
                shortCodeName: ward.short_codename
              }))
            }
          }))
        }
      }
    })

    return `Created city: ${city.name}`
  })

  await Promise.all(cityPromises)
}

main()
  .then(() => {
    console.log('Seeding completed!')
  })
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
