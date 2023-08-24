import express, { Application, Request, Response, NextFunction } from 'express'
import routerAuth from './routes/auth'
import routerRecipe from './routes/recipe'
import routerComment from './routes/comment'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'

const app: Application = express()
const port: number = 4000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/health', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ status: 200, message: 'Ok' })
})
app.use('/api/images', express.static(path.join(__dirname, './assets/images')))
app.use(routerAuth)
app.use(routerRecipe)
app.use(routerComment)
app.listen(port, () => console.log(`listening on port ${port}`))
