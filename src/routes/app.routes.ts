import { Router } from 'express'
import { getCashFlowController } from '~/controllers/app.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const appRouter = Router()
// làm lun cho thống nhất
appRouter.get('/get-cash-flow', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getCashFlowController))
export default appRouter
