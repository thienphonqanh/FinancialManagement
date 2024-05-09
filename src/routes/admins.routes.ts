import { Router } from 'express'
import { addCashflowCategoryController, addCashFlowController } from '~/controllers/admins.controllers'
import { cashFlowCategoryValidator, cashFlowValidator } from '~/middlewares/admins.middlewares'
import { accessTokenValidator, userRoleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import CashFlow from '~/models/schemas/CashFlow.schemas'
import databaseService from '~/services/database.services'
import { wrapRequestHandler } from '~/utils/handlers'

const adminsRouter = Router()

/**
 * Description. Add new cash flow
 * Path: /add-cash-flow
 * Method: POST
 * Body: { image: file, name: string }
 */
adminsRouter.post(
  '/add-cash-flow',
  accessTokenValidator,
  userRoleValidator,
  verifiedUserValidator,
  cashFlowValidator,
  wrapRequestHandler(addCashFlowController)
)

/**
 * Description. Add new cash flow category
 * Path: /add-cash-flow-category
 * Method: POST
 * Body: { image: file, name: string, cashflow_id: string, parent_id: string (sub_category) }
 */
adminsRouter.post(
  '/add-cash-flow-category',
  accessTokenValidator,
  userRoleValidator,
  verifiedUserValidator,
  cashFlowCategoryValidator,
  wrapRequestHandler(addCashflowCategoryController)
)
export default adminsRouter
