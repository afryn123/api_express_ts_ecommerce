import express from 'express'
// import path from 'path'
import controllers from '../controllers'

const recipeController = controllers.recipeController
const authController = controllers.authController

const router = express.Router()

router
  .route('/api/recipe')
  .post(authController.authorize, recipeController.create)
  .get(authController.authorize, recipeController.getAll)

router.route('/api/recipe/myrecipe').get(authController.authorize, recipeController.getMyRecipe)

router.route('/api/recipe/:id').get(authController.authorize, recipeController.getById)

export default router
