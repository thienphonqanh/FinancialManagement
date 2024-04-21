import { Request, Response, NextFunction } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, RegisterReqBody, TokenPayload, VerifyEmailReqBody } from '~/models/requests/User.requets'
import User from '~/models/schemas/User.schemas'
import { ObjectId } from 'mongodb'
import exp from 'constants'
import databaseService from '~/services/database.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.json({ message: USERS_MESSAGES.REGISTER_SUCCESS, result })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({ message: USERS_MESSAGES.LOGIN_SUCCESS, result })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  // Nếu không tìm thấy thì báo lỗi
  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  // Đã verify rồi thì sẽ không có lỗi -> trả về status OK với message đã verify trước đó
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }

  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
