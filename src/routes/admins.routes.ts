import { Router } from 'express'
import {
  addCashflowCategoryController,
  addCashFlowController,
  addMoneyAccountTypeController
} from '~/controllers/admins.controllers'
import {
  cashFlowCategoryValidator,
  cashFlowValidator,
  moneyAccountTypeValidator
} from '~/middlewares/admins.middlewares'
import { accessTokenValidator, userRoleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const adminsRouter = Router()

/**
 * Description. Add new cash flow
 * Path: /add-cash-flow
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { icon: string, name: string }
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
 * Header: { Authorization: Bearer <access_token> }
 * Body: { icon: string, name: string, cash_flow_id: string, parent_id: string (sub_category) }
 */
adminsRouter.post(
  '/add-cash-flow-category',
  accessTokenValidator,
  userRoleValidator,
  verifiedUserValidator,
  cashFlowCategoryValidator,
  wrapRequestHandler(addCashflowCategoryController)
)

/**
 * Description. Add new money acccount type
 * Path: /add-money-acccount-type
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { icon: string, name: string }
 */
adminsRouter.post(
  '/add-money-account-type',
  accessTokenValidator,
  userRoleValidator,
  verifiedUserValidator,
  moneyAccountTypeValidator,
  wrapRequestHandler(addMoneyAccountTypeController)
)

export default adminsRouter
