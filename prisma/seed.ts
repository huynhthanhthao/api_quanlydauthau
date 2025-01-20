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
  return await prisma.$transaction(async (tx: PrismaClient) => {
    const permissionGroups = await readJsonFile(
      'jsonData/permission-groups.json'
    )

    const provinces = await readJsonFile('jsonData/provinces.json')

    const groupPromises = permissionGroups.map(group =>
      tx.permissionGroup.create({
        data: {
          name: group.name,
          subGroups: {
            create: group.subGroups.map(subGroup => ({
              name: subGroup.name,
              permissions: {
                create: subGroup.permissions.map(permission => ({
                  code: permission.code,
                  name: permission.name
                }))
              }
            }))
          }
        }
      })
    )

    const cityPromises = provinces.map(async province => {
      const city = await tx.city.create({
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

    await Promise.all([cityPromises, groupPromises])

    const roles = await readJsonFile('jsonData/roles.json')

    const rolePromises = roles.map(role =>
      tx.role.create({
        data: {
          name: role.name,
          permissions: {
            connect: role.permissions.map(permission => ({
              code: permission.code
            }))
          }
        }
      })
    )

    const createdRoles = await Promise.all(rolePromises)

    const adminRole = createdRoles.find(role => role.name === 'Quản trị viên')

    await tx.user.create({
      data: {
        name: 'admin3',
        password: bcrypt.hashSync('aA@123', 10),
        username: 'admin3',
        roles: {
          connect: {
            id: adminRole.id
          }
        }
      }
    })
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
