import express from 'express'
import controllers from '../controllers'
import handleUpload from '../middleware/multer'

const recipeController = controllers.recipeController
const authController = controllers.authController

const router = express.Router()

router
  .route('/api/recipe')
  .get(recipeController.getAll)
  .post(authController.authorize, handleUpload, recipeController.create)

router.route('/api/recipe/myrecipe').get(authController.authorize, recipeController.getMyRecipe)

router.route('/api/recipe/:id').get(authController.authorize, recipeController.getById)

export default router
