import express from 'express'
// import path from 'path'
import controllers from '../controllers'

const authController = controllers.authController

const router = express.Router()

router.route('/api/register').post(authController.register)
router.route('/api/login').post(authController.login)

export default router
