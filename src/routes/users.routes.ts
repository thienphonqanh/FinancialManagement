import { Router } from 'express'
import { registerController, loginController } from '~/controllers/users.controllers'
import { registerValidator, loginValidator } from '~/middlewares/users.middlewares'
import { wrapRequesHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description. Login to account
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequesHandler(loginController))

/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string }
 */
usersRouter.post('/register', registerValidator, wrapRequesHandler(registerController))

export default usersRouter
