import { ADMINS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

const iconSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMINS_MESSAGES.ICON_PATH_IS_REQUIRED
  },
  isString: {
    errorMessage: ADMINS_MESSAGES.ICON_PATH_MUST_BE_A_STRING
  }
}

// Validator cho thêm dòng tiền (addCashFlow)
export const cashFlowValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: ADMINS_MESSAGES.CASH_FLOW_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMINS_MESSAGES.CASH_FLOW_NAME_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExist = await databaseService.cashFlows.findOne({ name: value })
            if (isExist !== null) {
              throw new Error(ADMINS_MESSAGES.CASH_FLOW_NAME_IS_EXIST)
            }
            return true
          }
        }
      },
      icon: iconSchema
    },
    ['body']
  )
)

// Validator cho thêm hạng mục (addCashFlowCategory)
export const cashFlowCategoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: ADMINS_MESSAGES.CASH_FLOW_CATEGORY_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMINS_MESSAGES.CASH_FLOW_CATEGORY_NAME_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExist = await databaseService.cashFlowCategories.findOne({ name: value })
            if (isExist !== null) {
              throw new Error(ADMINS_MESSAGES.CASH_FLOW_NAME_IS_EXIST)
            }
            // Kiểm tra trùng tên với parent, sub_category
            const isDuplicate = await databaseService.cashFlowCategories.findOne({
              $or: [{ name: value }, { 'sub_category.name': value }]
            })
            // Kiểm tra trùng tên
            if (isDuplicate !== null) {
              throw new Error(ADMINS_MESSAGES.CASH_FLOW_CATEGORY_NAME_IS_EXIST)
            }
            return true
          }
        }
      },
      cash_flow_id: {
        custom: {
          options: async (value: string, { req }) => {
            /* 
              Kiểm tra tồn tại của cash_flow_id và parent_id
              -> Phải có 1 trong hai để 1 là hạng mục cha, 2 là hạng mục con
            */
            if (value === undefined && req.body.parent_id === undefined) {
              throw new Error(ADMINS_MESSAGES.MUST_BE_A_PARENT_OR_CHILD_CATEGORY)
            }
            /*
              Nếu là cash_flow_id -> parent_category
              Nếu là parent_id -> sub_category
              -> Nếu tồn tại cả hai thì lỗi vì không thể vừa là hạng mục cha vừa là hạng mục con
            */
            if (req.body.parent_id !== undefined && value !== undefined) {
              throw new Error(ADMINS_MESSAGES.CAN_NOT_BE_BOTH_A_PARENT_AND_A_CHILD_CATEGORY)
            }
            if (value !== undefined) {
              if (!ObjectId.isValid(value)) {
                throw new Error(ADMINS_MESSAGES.CASH_FLOW_NOT_FOUND)
              }
              const isExist = await databaseService.cashFlows.findOne({ _id: new ObjectId(value) })
              if (isExist === null) {
                throw new Error(ADMINS_MESSAGES.CASH_FLOW_NOT_FOUND)
              }
              if (isExist.name === 'Vay nợ') {
                if (req.body.cash_flow_type === undefined) {
                  throw new Error(ADMINS_MESSAGES.LOAN_CATEGORY_MUST_CHOOSE_REVENUE_OR_SPENDING)
                }
              }
            }
            return true
          }
        }
      },
      parent_id: {
        custom: {
          options: async (value: string, { req }) => {
            /* 
              Kiểm tra tồn tại của cash_flow_id và parent_id
              -> Phải có 1 trong hai để 1 là hạng mục cha, 2 là hạng mục con
            */
            if (value === undefined && req.body.cash_flow_id === undefined) {
              throw new Error(ADMINS_MESSAGES.MUST_BE_A_PARENT_OR_CHILD_CATEGORY)
            }
            /*
              Nếu là cash_flow_id -> parent_category
              Nếu là parent_id -> sub_category
              -> Nếu tồn tại cả hai thì lỗi vì không thể vừa là hạng mục cha vừa là hạng mục con
            */
            if (req.body.cash_flow_id !== undefined && value !== undefined) {
              throw new Error(ADMINS_MESSAGES.CAN_NOT_BE_BOTH_A_PARENT_AND_A_CHILD_CATEGORY)
            }
            if (value !== undefined) {
              if (!ObjectId.isValid(value)) {
                throw new Error(ADMINS_MESSAGES.CASH_FLOW_NOT_FOUND)
              }
              const isExist = await databaseService.cashFlowCategories.findOne({ _id: new ObjectId(value) })
              if (isExist === null) {
                throw new Error(ADMINS_MESSAGES.CASH_FLOW_PARENT_CATEGORY_NOT_FOUND)
              }
            }
            return true
          }
        }
      },
      cash_flow_type: {
        optional: true,
        isNumeric: {
          errorMessage: ADMINS_MESSAGES.CASH_FLOW_TYPE_BE_A_NUMBER
        },
        custom: {
          options: async (value, { req }) => {
            if (req.body.cash_flow_id !== undefined) {
              const checkType = await databaseService.cashFlows.findOne({
                _id: new ObjectId(req.body.cash_flow_id as string)
              })
              if (checkType?.name !== 'Vay nợ') {
                if (value !== undefined) {
                  throw new Error(ADMINS_MESSAGES.ONLY_LOAN_CATEGORY_MUST_BE_CHOOSE_REVENUE_OR_SPENDING)
                }
              }
              // Kiểm tra nằm ngoài 0 và 1
              if (value < 0 || value > 1) {
                throw new Error(ADMINS_MESSAGES.CASH_FLOW_TYPE_BE_0_OR_1)
              }
            }
            return true
          }
        }
      },
      icon: iconSchema
    },
    ['body']
  )
)

// Validator cho thêm loại tài khoản tiền
export const moneyAccountTypeValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: ADMINS_MESSAGES.MONEY_ACCOUNT_TYPE_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMINS_MESSAGES.MONEY_ACCOUNT_TYPE_NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const isExist = await databaseService.moneyAccountTypes.findOne({ name: value })
            if (isExist !== null) {
              throw new Error(ADMINS_MESSAGES.MONEY_ACCOUNT_TYPE_NAME_IS_EXIST)
            }
            return true
          }
        }
      },
      icon: iconSchema
    },
    ['body']
  )
)
