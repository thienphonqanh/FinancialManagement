import { Request, Response, NextFunction } from 'express'
import { APP_MESSAGES } from '~/constants/messages'
import { ExpenseRecordReqBody, MoneyAccountReqBody } from '~/models/requests/Admin.requests'
import appServices from '~/services/app.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'

export const getCashFlowController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await appServices.getCashFlow()
  return res.json({ message: APP_MESSAGES.GET_CASH_FLOW_SUCCESS, data: data })
}

export const getCashFlowCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await appServices.getCashFlowCategory()
  return res.json({ message: APP_MESSAGES.GET_CASH_FLOW_SUCCESS, result: result })
}

export const getMoneyAccountTypeController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await appServices.getMoneyAccountType()
  return res.json({ message: APP_MESSAGES.GET_MONEY_ACCOUNT_TYPE_SUCCESS, result: result })
}

export const getMoneyAccountController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await appServices.getMoneyAccount(user_id)
  return res.json({ message: APP_MESSAGES.GET_MONEY_ACCOUNT_SUCCESS, result: result })
}

export const addMoneyAccountController = async (
  req: Request<ParamsDictionary, any, MoneyAccountReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await appServices.addMoneyAccount(req.body)
  return res.json({ result })
}

export const addExpenseRecordController = async (
  req: Request<ParamsDictionary, any, ExpenseRecordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await appServices.addExpenseRecord(req.body)
  return res.json({ result })
}
