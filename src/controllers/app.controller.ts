import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { APP_MESSAGES } from '~/constants/messages'
import appServices from '~/services/app.services'

export const getCashFlowController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await appServices.getCashFlow()
  return res.json({ message: APP_MESSAGES.GET_CASH_FLOW_SUCCESS, data: data })
}

export const getCashFlowCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await appServices.getCashFlowCategory()
  return res.json({ message: APP_MESSAGES.GET_CASH_FLOW_SUCCESS, result: result })
}
