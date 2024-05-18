import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  CashflowCategoryReqBody,
  CashflowReqBody,
  MoneyAccountTypeReqBody,
  UpdateCashflowReqBody
} from '~/models/requests/Admin.requests'
import adminsService from '~/services/admins.services'

export const addCashFlowController = async (
  req: Request<ParamsDictionary, any, CashflowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await adminsService.addCashflow(req.body)
  return res.json({ result })
}

export const updateCashFlowController = async (
  req: Request<ParamsDictionary, any, UpdateCashflowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await adminsService.updateCashflow(req.body)
  return res.json({ result })
}

export const addCashflowCategoryController = async (
  req: Request<ParamsDictionary, any, CashflowCategoryReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await adminsService.addCashflowCategory(req.body)
  return res.json({ result })
}

export const addMoneyAccountTypeController = async (
  req: Request<ParamsDictionary, any, MoneyAccountTypeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await adminsService.addMoneyAccountType(req.body)
  return res.json({ result })
}
