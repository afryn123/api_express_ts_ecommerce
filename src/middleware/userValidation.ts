import Joi from 'joi'

interface User {
  email: string
  name: string
  password: string
  image?: string
}

const validateRegister = (payload: User): any => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    image: Joi.string().allow(null, '')
  })
  return schema.validate(payload)
}

export default { validateRegister }
