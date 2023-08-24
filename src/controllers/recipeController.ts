import { Request, Response, NextFunction } from 'express'
import service from '../services/recipeService'
import validate from '../validation/recipeValidation'

interface AuthorizationToken extends Request {
  user?: any
}
interface Recipe {
  category: 'food' | 'drink'
  title: string
  status: 'private' | 'public'
  descriptions: string
  cooks: string
  image?: string
  author_id: string
}

const create = async (req: AuthorizationToken, res: Response, next: NextFunction): Promise<any> => {
  const { category, title, status, cooks, descriptions } = req.body
  const image = req.file?.filename
  const authorId: string = req.user.id.toLowerCase()

  const newRecipe: Recipe = { category, title, status, cooks, descriptions, image, author_id: authorId }
  const { error } = validate.validateRecipe(newRecipe)

  if (error ?? false) {
    res.status(422).json({
      status: false,
      message: error.details[0].message
    })
    return
  }

  await service
    .create(newRecipe)
    .then(() => {
      res.status(401).json({
        success: true,
        message: 'Success add recipe'
      })
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err.message
      })
    })
}

const getAll = async (req: Request, res: Response): Promise<any> => {
  await service
    .getAll()
    .then((data) => {
      res.status(200).json({
        success: true,
        data: data
      })
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err.message
      })
    })
}

const getMyRecipe = async (req: AuthorizationToken, res: Response): Promise<any> => {
  const authorId: string = req.user.id
  service
    .getByAuthorId(authorId)
    .then((data) => {
      res.status(401).json({
        success: true,
        data: data
      })
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err.message
      })
    })
}

const getById = async (req: Request, res: Response): Promise<any> => {
  const id: string = req.params.id
  service
    .getById(id)
    .then((data) => {
      res.status(401).json({
        success: true,
        data: data
      })
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: err.message
      })
    })
}

export default { create, getAll, getMyRecipe, getById }
