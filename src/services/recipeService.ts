import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface Recipe {
  id: string
  title: string
  category: 'food' | 'drink'
  status: 'private' | 'public'
  descriptions: string
  cooks: string
  image?: string | null
  author_id: string
}

interface newRecipe extends Recipe {
  createdAt: Date
  updatedAt?: Date | null
}

type RecipeType = newRecipe | null

type RecipeTypeArray = newRecipe[] | null

const create = async (value: Omit<Recipe, 'id'>): Promise<void> => {
  await prisma.recipe.create({
    data: value
  })
}

const update = async (id: string, value: Omit<Recipe, 'id'>): Promise<void> => {
  await prisma.recipe.update({
    where: { id: id },
    data: value
  })
}

const updateAvgRating = async (id: string, rating: number): Promise<void> => {
  await prisma.recipe.update({
    where: { id: id },
    data: { avg_rating: rating }
  })
}

const getById = async (id: string): Promise<RecipeType> => await prisma.recipe.findUnique({ where: { id: id } })

const getByAuthorId = async (authorId: string): Promise<RecipeTypeArray> =>
  await prisma.recipe.findMany({ where: { author_id: authorId } })

const remove = async (id: string): Promise<void> => {
  await prisma.recipe.delete({ where: { id: id } })
}

export default {
  create,
  update,
  updateAvgRating,
  getById,
  getByAuthorId,
  remove
}
