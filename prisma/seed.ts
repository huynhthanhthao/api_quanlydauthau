import * as fs from 'fs/promises'
import * as bcrypt from 'bcrypt'

import { PrismaClient } from '@prisma/client'

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

async function main() {
  const [permissionGroups, roles, companies, priorities] = await Promise.all([
    readJsonFile('jsonData/permission-groups.json'),
    readJsonFile('jsonData/roles.json'),
    readJsonFile('jsonData/companies.json'),
    readJsonFile('jsonData/priority.json')
  ])

  // const cityPromises = provinces.map(async province => {
  //   const city = await prisma.city.create({
  //     data: {
  //       code: province.code,
  //       name: province.name,
  //       phoneCode: province.phone_code,
  //       divisionType: province.division_type,
  //       districts: {
  //         create: province.districts.map(district => ({
  //           code: district.code,
  //           name: district.name,
  //           codeName: district.codename,
  //           divisionType: district.division_type,
  //           shortCodeName: district.short_codename,
  //           wards: {
  //             create: district.wards.map(ward => ({
  //               code: ward.code,
  //               name: ward.name,
  //               codeName: ward.codename,
  //               divisionType: ward.division_type,
  //               shortCodeName: ward.short_codename
  //             }))
  //           }
  //         }))
  //       }
  //     }
  //   })

  //   return `Created city: ${city.name}`
  // })

  // await Promise.all(cityPromises)

  const companyPromises = companies.map(company =>
    prisma.company.create({
      data: {
        name: company.name,
        address: company.address,
        email: company.email,
        phone: company.phone,
        tax: company.tax,
        website: company.website,
        representativeName: company.representativeName,
        representativePosition: company.representativePosition
      }
    })
  )

  const groupPromises = permissionGroups.map(group =>
    prisma.permissionGroup.create({
      data: {
        name: group.name,
        permissions: {
          create: group.permissions.map(permission => ({
            code: permission.code,
            name: permission.name
          }))
        }
      }
    })
  )

  const priorityPromises = priorities.map(priority =>
    prisma.priority.create({
      data: {
        name: priority.name,
        color: priority.color
      }
    })
  )

  await Promise.all([...groupPromises, ...companyPromises, ...priorityPromises])

  const rolePromises = roles.map(role =>
    prisma.role.create({
      data: {
        name: role.name,
        permissions: {
          connect: role.permissions.map(permission => ({
            code: permission
          }))
        }
      }
    })
  )

  const createdRoles = await Promise.all(rolePromises)

  const adminRole = createdRoles.find(role => role.name === 'Quản trị viên')

  await prisma.user.create({
    data: {
      name: 'admin',
      password: bcrypt.hashSync('aA@123', 10),
      username: 'admin',
      roleId: adminRole.id
    }
  })
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
