import { Decimal128, ObjectId } from 'mongodb'
import databaseService from './database.services'
import { config } from 'dotenv'
import CashFlowCategory, { CashFlowCategoryType } from '~/models/schemas/CashFlowCategory.schemas'
import CashFlowSubCategory, { CashFlowSubCategoryType } from '~/models/schemas/CashFlowSubCategory.schemas'
import MoneyAccount from '~/models/schemas/MoneyAccount.schemas'
import { APP_MESSAGES } from '~/constants/messages'
import { ExpenseRecordReqBody, MoneyAccountReqBody } from '~/models/requests/Admin.requests'
import ExpenseRecord from '~/models/schemas/ExpenseRecord.schemas'

config()

interface CashFlowCategoryResponseType {
  parent_category: CashFlowCategoryType
  sub_category: CashFlowSubCategoryType[]
}
class AppServices {
  async getCashFlow() {
    const data = await databaseService.cashFlows.find({}).toArray()
    return data
  }

  async getMoneyAccountType() {
    const result = await databaseService.moneyAccountTypes.find({}).toArray()
    return result
  }

  async getCashFlowCategory() {
    const result: CashFlowCategory[] = await databaseService.cashFlowCategories.find({}).toArray()
    // Tạo các nhóm cash flow
    const spending_money: CashFlowCategoryResponseType[] = [] // Chi tiền
    const revenue_money: CashFlowCategoryResponseType[] = [] // Thu tiền
    const loan_money: CashFlowCategoryResponseType[] = [] // Vay nợ

    // Sử dụng Promise.all để đợi tất cả các promises hoàn thành
    await Promise.all(
      result.map(async (item) => {
        // Lấy tên cash flow
        const cashFlowName = await databaseService.cashFlows.findOne(
          { _id: item.cash_flow_id },
          { projection: { _id: 0, name: 1 } }
        )
        // Tạo value trả về
        const responseValue: CashFlowCategoryResponseType = {
          parent_category: {
            _id: item._id,
            icon: item.icon,
            name: item.name,
            cash_flow_id: item.cash_flow_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            isChosen: item.isChosen,
            isExpanded: item.isExpanded
          },
          sub_category: item.sub_category.map((subItem: CashFlowSubCategory) => ({
            _id: subItem._id,
            icon: subItem.icon,
            name: subItem.name,
            isChosen: subItem.isChosen,
            parent_id: subItem.parent_id
          }))
        }
        // Kiểm tra cash_flow
        if (cashFlowName?.name === 'Chi tiền') {
          spending_money.push(responseValue)
        } else if (cashFlowName?.name === 'Thu tiền') {
          revenue_money.push(responseValue)
        } else {
          loan_money.push(responseValue)
        }
      })
    )

    return {
      spending_money: spending_money,
      revenue_money: revenue_money,
      loan_money: loan_money
    }
  }

  // Thêm mới loại tài khoản tiền (tiền mặt, ngân hàng, ...)
  async addMoneyAccount(payload: MoneyAccountReqBody) {
    if (payload.report !== undefined && (payload.report.toString() === '0' || payload.report.toString() === '1')) {
      payload.report = parseInt(payload.report.toString())
    }
    const moneyAccount = new MoneyAccount({
      ...payload,
      user_id: new ObjectId(payload.user_id),
      money_account_type_id: new ObjectId(payload.money_account_type_id),
      account_balance: new Decimal128(payload.account_balance),
      credit_limit_number: new Decimal128(payload.credit_limit_number || '0')
    })
    await databaseService.moneyAccounts.insertOne(moneyAccount)
    return APP_MESSAGES.ADD_MONEY_ACCOUNT_SUCCESS
  }

  // Lấy danh sách các tài khoản tiền của người dùng
  async getMoneyAccount(user_id: string) {
    const result = await databaseService.moneyAccounts.find({ user_id: new ObjectId(user_id) }).toArray()
    return result
  }

  // Thêm mới bản ghi chi tiêu
  async addExpenseRecord(payload: ExpenseRecordReqBody) {
    if (payload.report !== undefined && (payload.report.toString() === '0' || payload.report.toString() === '1')) {
      payload.report = parseInt(payload.report.toString())
    }
    const expenseRecord = new ExpenseRecord({
      ...payload,
      amount_of_money: new Decimal128(payload.amount_of_money),
      cash_flow_category_id: new ObjectId(payload.cash_flow_category_id),
      money_account_id: new ObjectId(payload.money_account_id),
      user_id: new ObjectId(payload.user_id),
      cost_incurred: new Decimal128(payload.cost_incurred || '0') // Add this line to convert cost_incurred to Decimal128
    })
    await databaseService.expenseRecords.insertOne(expenseRecord)
    return APP_MESSAGES.ADD_EXPENSE_RECORD_SUCCESS
  }
}

const appServices = new AppServices()
export default appServices
