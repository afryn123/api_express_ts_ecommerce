import Joi from 'joi'

interface Recipe {
  category: string
  status: 'private' | 'public'
  descriptions: string
  cooks: string
  image?: string
  author_id: string
}

const validateRecipe = (payload: Recipe): any => {
  const schema = Joi.object({
    category: Joi.string().required(),
    status: Joi.string().valid('private', 'public').required(),
    title: Joi.string().required(),
    descriptions: Joi.string().required(),
    cooks: Joi.string().required(),
    image: Joi.string().allow('', null),
    author_id: Joi.string().required()
  })
  return schema.validate(payload)
}

export default { validateRecipe }
