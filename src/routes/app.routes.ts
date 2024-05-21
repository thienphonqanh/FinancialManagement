import { Router } from 'express'
import {
  getCashFlowController,
  getCashFlowCategoryController,
  addMoneyAccountController,
  getMoneyAccountTypeController,
  getMoneyAccountController,
  addExpenseRecordController,
  updateMoneyAccountController,
  deleteMoneyAccountController,
  getInfoMoneyAccountController,
  getExpenseRecordForStatisticsController,
  getExpenseRecordOfEachMoneyAccountController,
  getHistoryOfExpenseRecordController
} from '~/controllers/app.controller'
import {
  moneyAccountValidator,
  expenseRecordValidator,
  updateMoneyAccountValidator,
  getInfoMoneyAccountValidator,
  getExpenseRecordOfEachMoneyAccountValidator,
  getHistoryOfExpenseRecordValidator
} from '~/middlewares/apps.middlewares'
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
 *  name: string, account_balance: string (Decimal128),
 *  money_account_type_id: string (ObjectId),
 * (Optional)
 *  description: string, report: string (0 - 1) (enum IncludedReport),
 *  select_bank: string, credit_limit_number: string (Decimal128)
 * }
 */
appsRouter.post(
  '/add-money-account',
  accessTokenValidator,
  verifiedUserValidator,
  moneyAccountValidator,
  wrapRequestHandler(addMoneyAccountController)
)

/**
 * Description. Update money acccount
 * Path: /update-money-acccount
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: { money_account_id: string (ObjectId), MoneyAccountSchema }
 */
appsRouter.patch(
  '/update-money-account',
  accessTokenValidator,
  verifiedUserValidator,
  updateMoneyAccountValidator,
  wrapRequestHandler(updateMoneyAccountController)
)

/**
 * Description: DELETE a collection in  money account
 * Path: /app/delete-money-account
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
appsRouter.delete(
  '/delete-money-account',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deleteMoneyAccountController)
)

/**
 * Description: Get information of money account
 * Path: /money-account/money-account-id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: { money_account_id: string (ObjectId) }
 */
appsRouter.get(
  '/money-account/:money_account_id',
  accessTokenValidator,
  verifiedUserValidator,
  getInfoMoneyAccountValidator,
  wrapRequestHandler(getInfoMoneyAccountController)
)

/**
 * Description. Add new expense record
 * Path: /add-expense-record
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {
 *  amount_of_money: string (Decimal128), cash_flow_category_id: string (ObjectId),
 *  money_account_id: string (ObjectId),
 * (Optional)
 *  description: string, report: number (enum IncludedReport),
 *  occur_date: date, trip_or_event: string, location: string,
 *  pay_for_who: string, collect_from_who: string,
 *  repayment_date: date, debt_collection_date: date,
 *  cost_incurred: string (Decimal128), cost_incurred_category_id: string (ObjectId),
 *  proof_image: string
 * }
 */
appsRouter.post(
  '/add-expense-record',
  accessTokenValidator,
  verifiedUserValidator,
  expenseRecordValidator,
  wrapRequestHandler(addExpenseRecordController)
)

/**
 * Description: Get information of expense record for statistics
 * Path: /expense-record-for-statistics
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
appsRouter.get(
  '/expense-record-for-statistics',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getExpenseRecordForStatisticsController)
)

/**
 * Description: Get information of expense record of each money account (filter over time)
 * Path: /expense-record/:money_account_id/:time
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: { money_account_id: string (ObjectId), time: string (get all: all, get by month: mm-yyyy) }
 */
appsRouter.get(
  '/expense-record/:money_account_id/:time',
  accessTokenValidator,
  verifiedUserValidator,
  getExpenseRecordOfEachMoneyAccountValidator,
  wrapRequestHandler(getExpenseRecordOfEachMoneyAccountController)
)

/**
 * Description: Get information of history of expense record (filter over time)
 * Path: /expense-record/:time
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: { time: string (get all: all, get by month: mm-yyyy) }
 */
appsRouter.get(
  '/expense-record/:time',
  accessTokenValidator,
  verifiedUserValidator,
  getHistoryOfExpenseRecordValidator,
  wrapRequestHandler(getHistoryOfExpenseRecordController)
)

export default appsRouter
