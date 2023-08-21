import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import service from '../services/authService'
import validate from '../middleware/userValidation'
const secretKey: string = 'This is a secret key'

const salt = bcrypt.genSaltSync(10)

interface AuthorizationToken extends Request {
  user?: any
}

interface User {
  id: string
  email: string
  name: string
  password?: string
  image: string
}

// interface Responses {
//   success: boolean
//   data?: any
//   token?: string
//   message?: string
// }

const register = async (req: Request, res: Response): Promise<any> => {
  const user = await service.getByEmail(req.body.email)

  const { error } = validate.validateRegister(req.body) // Finds the validation errors in this request and wraps them in an object with handy functions
  if (user !== null) {
    res.status(403).json({
      success: false,
      message: 'email sudah terdaftar'
    })
    return
  }

  if (error ?? false) {
    res.status(422).json({
      status: false,
      message: error.details[0].message
    })
    return
  }
  const { name, email, image } = req.body
  const password = bcrypt.hashSync(req.body.password, salt)
  const newUsers = {
    name,
    email,
    password,
    image
  }
  service
    .create(newUsers)
    .then(() => {
      res.status(201).json({
        success: true,
        message: 'User berhasil terdaftar'
      })
    })
    .catch((err) => {
      res.status(422).json({
        success: false,
        message: err.message
      })
    })
}

const checkPassword = async (encryptedPassword: any, password: any): Promise<boolean> => {
  const result: boolean = await new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isValid): void => {
      if (err !== null) {
        reject(err)
        return
      }
      resolve(isValid)
    })
  })
  return result
}

const createToken = (payload: User): string => jwt.sign(payload, secretKey, { expiresIn: '2d' })

const login = async (req: Request, res: Response): Promise<any> => {
  const user = await service.getByEmail(req.body.email)

  if (user === null) {
    res.status(404).json({
      succeess: false,
      message: 'User not found'
    })
    return
  }

  const isValid = await checkPassword(user.password, req.body.password)

  if (!isValid) {
    res.status(401).json({
      success: false,
      message: 'Invalid Password'
    })
    return
  }

  const { id, name, email, image } = user
  const token = createToken({
    id,
    name,
    email,
    image
  })

  res.status(201).json({
    success: true,
    token
  })
}

const authorize = async (req: AuthorizationToken, res: Response, next: NextFunction): Promise<any> => {
  try {
    const bearerToken = req.headers.authorization
    let token: string = ''
    if (bearerToken?.startsWith('Bearer')) {
      token = bearerToken.split(' ')[1]
    } else {
      token = ''
    }
    const tokenPayload = jwt.verify(token, secretKey)

    req.user = tokenPayload
    next()
  } catch (err: any) {
    res.status(401).json({
      status: 'Unauthorized',
      message: err.message
    })
  }
}

export default { login, authorize, register }
