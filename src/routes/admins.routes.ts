import { Router } from 'express'
import { addCashflowCategoryController, addCashFlowController } from '~/controllers/admins.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const adminsRouter = Router()

/**
 * Description. Add new cash flow
 * Path: /add-cashflow
 * Method: POST
 * Body: { image: file, name: string }
 */
adminsRouter.post(
  '/add-cashflow',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(addCashFlowController)
)

/**
 * Description. Add new cash flow category
 * Path: /add-cashflow-category
 * Method: POST
 * Body: { image: file, name: string, cashflow_id: string, parent_id: string (sub_category) }
 */
adminsRouter.post(
  '/add-cashflow-category',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(addCashflowCategoryController)
)
export default adminsRouter
