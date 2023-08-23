import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface User {
  id: string
  email: string
  name: string
  password: string
  image: string | null
}

interface newUser extends User {
  createdAt: Date
  updatedAt?: Date | null
}

type UserType = newUser | null

const create = async (value: Omit<User, 'id'>): Promise<void> => {
  await prisma.user.create({
    data: value
  })
}

const update = async (id: string, value: User): Promise<void> => {
  await prisma.user.update({
    where: { id: id },
    data: value
  })
}

const getById = async (id: string): Promise<UserType> => await prisma.user.findUnique({ where: { id: id } })

const getByEmail = async (email: string): Promise<UserType> => await prisma.user.findUnique({ where: { email: email } })

const remove = async (id: string): Promise<UserType> => await prisma.user.delete({ where: { id: id } })

export default {
  create,
  update,
  getById,
  getByEmail,
  remove
}
