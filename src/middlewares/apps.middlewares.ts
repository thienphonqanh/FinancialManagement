import { checkSchema } from 'express-validator'
import { ObjectId, WithId } from 'mongodb'
import { APP_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'
import MoneyAccount from '~/models/schemas/MoneyAccount.schemas'

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
          options: async (value: string, { req }) => {
            // Kiểm tra xem id loại tài khoản có hợp lệ không
            const isValid = await databaseService.moneyAccountTypes.findOne({ _id: new ObjectId(value) })
            if (isValid === null) {
              throw new Error(APP_MESSAGES.MONEY_ACCOUNT_TYPE_NOT_FOUND)
            }
            if (isValid.name === 'Thẻ tín dụng') {
              if (req.body.credit_limit_number === undefined) {
                throw new Error(APP_MESSAGES.CREDIT_LIMIT_NUMBER_IS_REQUIRED)
              }
            }
            const user_id = req.body.user_id as string
            // Kiểm tra tài khoản đã tồn tại chưa (1 acc chỉ có các loại tài khoản tiền khác nhau)
            const user = await databaseService.moneyAccounts.findOne(
              { user_id: new ObjectId(user_id) },
              { projection: { money_account_type_id: 1 } }
            )
            if (user === null) {
              return true
            }
            if ((user as WithId<MoneyAccount>).money_account_type_id.toString() === value) {
              throw new Error(APP_MESSAGES.MONEY_ACCOUNT_IS_EXIST)
            }
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
            if (value <= 0) {
              throw new Error(APP_MESSAGES.CREDIT_LIMIT_NUMBER_MUST_BE_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      report: {
        optional: true,
        isNumeric: {
          errorMessage: APP_MESSAGES.REPORT_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            // Kiểm tra nằm ngoài 0 và 1
            if (value < 0 || value > 1) {
              throw new Error(APP_MESSAGES.REPORT_MUST_BE_0_OR_1)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const expenseRecordValidator = validate(
  checkSchema(
    {
      amount_of_money: {
        notEmpty: {
          errorMessage: APP_MESSAGES.EXPENSE_RECORD_AMOUNT_OF_MONEY_IS_REQUIRED
        },
        isNumeric: {
          errorMessage: APP_MESSAGES.EXPENSE_RECORD_AMOUNT_OF_MONEY_MUST_BE_A_NUMBER
        },
        custom: {
          options: async (value) => {
            if (value < 0) {
              throw new Error(APP_MESSAGES.EXPENSE_RECORD_AMOUNT_OF_MONEY_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
            }
            return true
          }
        }
      },
      cash_flow_category_id: {
        notEmpty: {
          errorMessage: APP_MESSAGES.CASH_FLOW_CATEGORY_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: APP_MESSAGES.CASH_FLOW_CATEGORY_ID_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value: string) => {
            // Kiểm tra xem id hạng mục có hợp lệ không
            const isValid = await databaseService.cashFlowCategories.findOne({ _id: new ObjectId(value) })
            if (isValid === null) {
              throw new Error(APP_MESSAGES.CASH_FLOW_CATEGORY_NOT_FOUND)
            }
          }
        }
      },
      money_account_id: {
        notEmpty: {
          errorMessage: APP_MESSAGES.MONEY_ACCOUNT_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: APP_MESSAGES.MONEY_ACCOUNT_ID_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value: string) => {
            // Kiểm tra xem id tài khoản tiền có hợp lệ không
            const isValid = await databaseService.moneyAccounts.findOne({ _id: new ObjectId(value) })
            if (isValid === null) {
              throw new Error(APP_MESSAGES.MONEY_ACCOUNT_NOT_FOUND)
            }
          }
        }
      }
    },
    ['body']
  )
)
