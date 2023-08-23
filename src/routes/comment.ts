import express from 'express'
// import path from 'path'
import controllers from '../controllers'

const commentController = controllers.commentController
const authController = controllers.authController

const router = express.Router()

router.route('/api/comment').post(authController.authorize, commentController.create)
router.route('/api/comment/:recipe_id').get(authController.authorize, commentController.getByRecipeId)

export default router
