import { Router } from 'express'
import {
  getCashFlowController,
  getCashFlowCategoryController,
  addMoneyAccountController,
  getMoneyAccountTypeController,
  getMoneyAccountController
} from '~/controllers/app.controller'
import { moneyAccountValidator } from '~/middlewares/apps.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const appsRouter = Router()

/**
 * Description. Get cash flow
 * Path: /get-cash-flow
 * Method: GET
 */
appsRouter.get('/get-cash-flow', wrapRequestHandler(getCashFlowController))

/**
 * Description. Get cash flow category
 * Path: /get-cash-flow-category
 * Method: GET
 */
appsRouter.get('/get-cash-flow-category', wrapRequestHandler(getCashFlowCategoryController))

/**
 * Description. Get money account type
 * Path: /get-money-account-type
 * Method: GET
 */
appsRouter.get('/get-money-account-type', wrapRequestHandler(getMoneyAccountTypeController))

/**
 * Description. Get money account of user
 * Path: /get-money-account
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
appsRouter.get(
  '/get-money-account',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getMoneyAccountController)
)

/**
 * Description. Add new money acccount
 * Path: /add-money-acccount
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {
 *  name: string, account_balance: number (Decimal128),
 *  money_account_type_id: string (ObjectId), user_id: string (ObjectId),
 * (Optional)
 *  description: string, report: number (enum IncludedReport),
 *  select_bank: number, credit_limit_number: number (Decimal128)
 * }
 */
appsRouter.post(
  '/add-money-account',
  accessTokenValidator,
  verifiedUserValidator,
  moneyAccountValidator,
  wrapRequestHandler(addMoneyAccountController)
)

export default appsRouter
