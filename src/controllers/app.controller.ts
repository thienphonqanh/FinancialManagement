import { Request, Response, NextFunction } from 'express'
import { APP_MESSAGES } from '~/constants/messages'
import { MoneyAccountReqBody } from '~/models/requests/Admin.requests'
import appServices from '~/services/app.services'
import { ParamsDictionary } from 'express-serve-static-core'

export const getCashFlowController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await appServices.getCashFlow()
  return res.json({ message: APP_MESSAGES.GET_CASH_FLOW_SUCCESS, data: data })
}

export const getCashFlowCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await appServices.getCashFlowCategory()
  return res.json({ message: APP_MESSAGES.GET_CASH_FLOW_SUCCESS, result: result })
}

export const addMoneyAccountController = async (
  req: Request<ParamsDictionary, any, MoneyAccountReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await appServices.addMoneyAccount(req.body)
  return res.json({ result })
}
