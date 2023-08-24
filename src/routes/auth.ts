import express from 'express'
import controllers from '../controllers'
import handleUploadImage from '../middleware/multer'

const authController = controllers.authController

const router = express.Router()

router.route('/api/register').post(handleUploadImage, authController.register)
router.route('/api/login').post(authController.login)
router.route('/api/user').get(authController.authorize, authController.getMyProfile)
router.route('/api/user/:id').delete(authController.authorize, authController.remove)

export default router
