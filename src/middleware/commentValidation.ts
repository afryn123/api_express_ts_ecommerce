import Joi from 'joi'

interface Comment {
  comment: string | null
  rating: number
  author_id: string
  recipe_id: string
}

const validateComment = (payload: Comment): any => {
  const schema = Joi.object({
    comment: Joi.string().allow('', null),
    rating: Joi.number().required(),
    author_id: Joi.string().required(),
    recipe_id: Joi.string().required()
  })
  return schema.validate(payload)
}

export default { validateComment }
