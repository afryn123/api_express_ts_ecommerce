import express, { Application, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import routerAuth from './routes/auth'
import routerRecipe from './routes/recipe'
import routeComment from './routes/comment'
import cors from 'cors'
import path from 'path'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const app: Application = express()
const port: number = 4000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/health', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ status: 200, message: 'Ok' })
})

const fileStorage = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null, 'src/assets/images')
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, `${new Date().getTime()}-${file.originalname}`)
  }
})

const fileFilter = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const upload = multer({ storage: fileStorage, fileFilter: fileFilter })

app.use('/api/images', express.static(path.join(__dirname, './assets/images')))
app.use(upload.single('image'))
app.use(routerAuth)
app.use(routerRecipe)
app.use(routeComment)
app.listen(port, () => console.log(`listening on port ${port}`))
