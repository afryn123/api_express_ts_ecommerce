import express from 'express'
// import path from 'path'
import controllers from '../controllers'

const recipeController = controllers.recipeController
const authController = controllers.authController

const router = express.Router()

router.route('/api/recipe').post(authController.authorize, recipeController.create)
// router.route('/api/login').post(authController.login)
// router.route('/api/authorized').post(authController.authorize)

export default router
