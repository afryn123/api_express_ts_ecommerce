import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface User {
  email: string
  name: string
  password: string
  image: string
}

const create = async (value: User): Promise<void> => {
  await prisma.user.create({
    data: value
  })
}
const get = async (id: string): Promise<any> => await prisma.user.findUnique({ where: { id: id } })

const getByEmail = async (email: string): Promise<any> => await prisma.user.findUnique({ where: { email: email } })
export default { create, get, getByEmail }
