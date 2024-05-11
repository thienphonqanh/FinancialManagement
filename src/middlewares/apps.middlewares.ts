import { checkSchema } from 'express-validator'
import { ObjectId, WithId } from 'mongodb'
import { APP_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'
import { Request, Response, NextFunction } from 'express'
import { TokenPayload } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'

// Validator cho thêm mới tài khoản tiền
export const moneyAccountValidator = validate(
  checkSchema(
    {
      account_balance: {
        notEmpty: {
          errorMessage: APP_MESSAGES.ACCOUNT_BALANCE_MUST_IS_REQUIRED
        },
        isNumeric: {
          errorMessage: APP_MESSAGES.ACCOUNT_BALANCE_MUST_BE_A_NUMBER
        },
        custom: {
          options: async (value) => {
            if (value < 0) {
              throw new Error(APP_MESSAGES.ACCOUNT_BALANCE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
            }
            return true
          }
        }
      },
      name: {
        notEmpty: {
          errorMessage: APP_MESSAGES.MONEY_ACCOUNT_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: APP_MESSAGES.MONEY_ACCOUNT_NAME_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExist = await databaseService.moneyAccounts.findOne({ name: value })
            if (isExist !== null) {
              throw new Error(APP_MESSAGES.MONEY_ACCOUNT_NAME_IS_EXIST)
            }
            return true
          }
        }
      },
      user_id: {
        notEmpty: {
          errorMessage: APP_MESSAGES.USER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: APP_MESSAGES.USER_ID_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value: string) => {
            const isExist = await databaseService.users.findOne({ _id: new ObjectId(value) })
            if (isExist === null) {
              throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
            }
            return true
          }
        }
      },
      money_account_type_id: {
        notEmpty: {
          errorMessage: APP_MESSAGES.MONEY_ACCOUNT_MUST_BELONG_TO_MONEY_ACCOUNT_TYPE
        },
        isString: {
          errorMessage: APP_MESSAGES.MONEY_ACCOUNT_TYPE_ID_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value: string) => {
            const isExist = await databaseService.moneyAccountTypes.findOne({ _id: new ObjectId(value) })
            if (isExist === null) {
              throw new Error(APP_MESSAGES.MONEY_ACCOUNT_TYPE_NOT_FOUND)
            }
            return true
          }
        }
      },
      credit_limit_number: {
        optional: true,
        isNumeric: {
          errorMessage: APP_MESSAGES.CREDIT_LIMIT_NUMBER_MUST_BE_A_NUMBER
        },
        custom: {
          options: async (value) => {
            if (value < 0) {
              throw new Error(APP_MESSAGES.CREDIT_LIMIT_NUMBER_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
