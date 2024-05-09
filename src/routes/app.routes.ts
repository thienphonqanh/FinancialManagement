import { Router } from 'express'
import { getCashFlowController, getCashFlowCategoryController } from '~/controllers/app.controller'
import { wrapRequestHandler } from '~/utils/handlers'

const appRouter = Router()

/**
 * Description. Get cash flow
 * Path: /get-cash-flow
 * Method: GET
 */
appRouter.get('/get-cash-flow', wrapRequestHandler(getCashFlowController))

/**
 * Description. Get cash flow category
 * Path: /get-cash-flow-category
 * Method: GET
 */
appRouter.get('/get-cash-flow-category', wrapRequestHandler(getCashFlowCategoryController))

export default appRouter
