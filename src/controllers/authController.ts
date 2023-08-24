import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import service from '../services/authService'
import validate from '../validation/userValidation'

const secretKey: string = process.env.SECRET_KEY ?? 'Default'

const salt = bcrypt.genSaltSync(10)
interface User {
  id: string
  email: string
  name: string
  password: string
  image: string | null
}

type UserType = Partial<User> | null
interface AuthorizationToken extends Request {
  user?: any
}

const register = async (req: Request, res: Response): Promise<any> => {
  const user = await service.getByEmail(req.body.email)

  if (user !== null) {
    res.status(403).json({
      success: false,
      message: 'email sudah terdaftar'
    })
    return
  }

  const { name, email, password }: User = req.body
  const image = req.file?.filename
  const newUsers = {
    name,
    email,
    password,
    image
  }
  const { error } = validate.validateRegister(req.body)
  if (error ?? false) {
    res.status(422).json({
      status: false,
      message: error.details[0].message
    })
    return
  }
  newUsers.password = bcrypt.hashSync(password, salt)

  await service
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

const checkPassword = async (encryptedPassword: string, password: string): Promise<boolean> => {
  const result: boolean = await new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isValid): any => {
      if (err ?? false) {
        reject(err)
        return
      }
      resolve(isValid)
    })
  })
  return result
}

const createToken = (payload: Pick<User, 'id' | 'name'>): string => jwt.sign(payload, secretKey, { expiresIn: '2d' })

const login = async (req: Request, res: Response): Promise<any> => {
  const user = await service.getPassByEmail(req.body.email)
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

  const { id, name } = user
  const token = createToken({
    id,
    name
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
      success: false,
      status: 'Unauthorized',
      message: err.message
    })
  }
}

const getMyProfile = async (req: AuthorizationToken, res: Response): Promise<void> => {
  const id: string = req.user.id
  await service
    .getMyProfile(id)
    .then((data: UserType) => {
      res.status(200).json({ success: true, data: data })
    })
    .catch((err) => {
      res.status(403).json({ success: false, message: err })
    })
}

const remove = async (req: Request, res: Response): Promise<any> => {
  const id: string = req.params.id
  service
    .remove(id)
    .then(() => {
      res.status(200).json({
        success: true,
        message: `Data ${id} successfully removed`
      })
    })
    .catch((err: any) => {
      res.status(401).json({
        success: false,
        message: err.message
      })
    })
}

export default { login, authorize, register, remove, getMyProfile }
