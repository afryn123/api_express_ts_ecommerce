import { Request, Response } from 'express'
import service from '../services/commentService'
import validate from '../middleware/commentValidation'

interface AuthorizationToken extends Request {
  user?: any
}

const create = async (req: AuthorizationToken, res: Response): Promise<any> => {
  const { comment, rating } = req.body
  const authorId = req.user.id.toLowerCase()
  const recipeId = req.params.id.toLowerCase()

  const newData = {
    comment,
    rating,
    author_id: authorId,
    recipe_id: recipeId
  }

  const { error } = validate.validateComment(newData)
  if (error ?? false) {
    res.status(422).json({
      status: false,
      message: error.details[0].message
    })
    return
  }

  await service
    .create(newData)
    .then(() => {
      res.status(201).json({
        success: true,
        message: 'success'
      })
    })
    .catch((err: any) => {
      res.status(401).json({
        success: false,
        message: err.message
      })
    })
}

const getByRecipeId = async (req: Request, res: Response): Promise<any> => {
  const recipeId = req.params.recipe_id
  await service
    .getRecipeId(recipeId)
    .then((data) => {
      res.status(200).json({
        success: true,
        data: data
      })
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message: err.message
      })
    })
}
export default { create, getByRecipeId }
