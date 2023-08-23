import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface Comment {
  id: string
  comment: string | null
  rating: number
  author_id: string
  recipe_id: string
}

interface NewComment extends Comment {
  createdAt: Date
  updatedAt?: Date | null
}

type CommentType = NewComment | null
type CommentTypeArr = CommentType[] | null

const create = async (value: Omit<Comment, 'id'>): Promise<void> => {
  await prisma.comment.create({
    data: value
  })
}

const createMany = async (value: any): Promise<any> => {
  await prisma.$transaction(async (tx) => {
    await tx.comment.createMany({
      data: value
    })
  })
}

const getById = async (id: string): Promise<CommentType> => await prisma.comment.findUnique({ where: { id: id } })

const getRecipeId = async (recipeId: string): Promise<CommentTypeArr> =>
  await prisma.comment.findMany({ where: { recipe_id: recipeId } })

const remove = async (id: string): Promise<void> => {
  await prisma.comment.delete({
    where: { id: id }
  })
}

export default {
  create,
  createMany,
  getById,
  getRecipeId,
  remove
}
