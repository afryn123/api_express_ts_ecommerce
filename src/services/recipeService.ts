import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface Recipe {
  category: string
  status: 'private' | 'public'
  descriptions: string
  cooks: string
  image: string
  author_id: string
}

const create = async (value: Recipe): Promise<void> => {
  await prisma.recipe.create({
    data: value
  })
}

export default { create }
