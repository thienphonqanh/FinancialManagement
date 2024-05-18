import { Router } from 'express'
import {
  addCashflowCategoryController,
  addCashFlowController,
  addMoneyAccountTypeController,
  updateCashFlowController,
  deleteCashFlowController
} from '~/controllers/admins.controllers'
import {
  cashFlowCategoryValidator,
  cashFlowValidator,
  moneyAccountTypeValidator,
  updateCashFlowValidator,
  deleteCashFlowValidator
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
 * Description. Update cash flow
 * Path: /update-cash-flow
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: { cash_flow_id: string (ObjectId), CashFlowSchema }
 */
adminsRouter.patch(
  '/update-cash-flow',
  accessTokenValidator,
  userRoleValidator,
  verifiedUserValidator,
  updateCashFlowValidator,
  wrapRequestHandler(updateCashFlowController)
)

/**
 * Description. Delete cash flow
 * Path: /delete-cash-flow
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { cash_flow_id: string (ObjectId) }
 */
adminsRouter.delete(
  '/delete-cash-flow/:cash_flow_id',
  accessTokenValidator,
  userRoleValidator,
  verifiedUserValidator,
  deleteCashFlowValidator,
  wrapRequestHandler(deleteCashFlowController)
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
