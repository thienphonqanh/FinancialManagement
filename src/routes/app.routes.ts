import { Router } from 'express'
import {
  getCashFlowController,
  getCashFlowCategoryController,
  addMoneyAccountController
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
 * Description. Add new money acccount
 * Path: /add-money-acccount
 * Method: POST
 * Body: {
 *  name: string, account_balance: number (Decimal128),
 *  money_account_type: string (ObjectId),
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
