import { Decimal128, ObjectId } from 'mongodb'
import databaseService from './database.services'
import CashFlowCategory, { CashFlowCategoryType } from '~/models/schemas/CashFlowCategory.schemas'
import CashFlowSubCategory, { CashFlowSubCategoryType } from '~/models/schemas/CashFlowSubCategory.schemas'
import MoneyAccount from '~/models/schemas/MoneyAccount.schemas'
import { APP_MESSAGES } from '~/constants/messages'
import {
  DeleteMoneyAccountReqBody,
  ExpenseRecordReqBody,
  MoneyAccountReqBody,
  UpdateMoneyAccountReqBody
} from '~/models/requests/App.requests'
import ExpenseRecord from '~/models/schemas/ExpenseRecord.schemas'

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
            cash_flow_type: item.cash_flow_type,
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
    const result = await databaseService.moneyAccounts
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id)
          }
        },
        {
          $lookup: {
            from: 'money_account_types',
            localField: 'money_account_type_id', // Trường trong moneyAccounts
            foreignField: '_id', // Trường trong money_account_types
            as: 'money_type_information' // Tên trường kết quả join
          }
        },
        {
          $unwind: '$money_type_information' // Dùng để "mở" mảng money_type_information ra để truy cập các trường bên trong.
        },
        {
          // Chỉ định các trường mà bạn muốn bao gồm trong kết quả cuối cùng
          $project: {
            _id: 1,
            name: 1,
            account_balance: 1,
            user_id: 1,
            money_account_type_id: 1,
            description: 1,
            report: 1,
            select_bank: 1,
            credit_limit_number: 1,
            'money_type_information.icon': 1,
            'money_type_information.name': 1
          }
        }
      ])
      .toArray()

    return result
  }

  // Thêm mới bản ghi chi tiêu
  async addExpenseRecord(payload: ExpenseRecordReqBody) {
    // Kiểm tra tồn tại các trường date -> chuyển string thành date
    if (payload.occur_date !== undefined) {
      payload.occur_date = new Date(payload.occur_date)
    }
    if (payload.debt_collection_date !== undefined) {
      payload.debt_collection_date = new Date(payload.debt_collection_date)
    }
    if (payload.repayment_date !== undefined) {
      payload.repayment_date = new Date(payload.repayment_date)
    }
    if (payload.report !== undefined && (payload.report.toString() === '0' || payload.report.toString() === '1')) {
      payload.report = parseInt(payload.report.toString())
    }
    const expenseRecord = new ExpenseRecord({
      ...payload,
      amount_of_money: new Decimal128(payload.amount_of_money),
      cash_flow_id: new ObjectId(payload.cash_flow_id),
      cash_flow_category_id: new ObjectId(payload.cash_flow_category_id),
      money_account_id: new ObjectId(payload.money_account_id),
      cost_incurred: new Decimal128(payload.cost_incurred || '0'),
      cost_incurred_category_id: new ObjectId(payload.cost_incurred_category_id)
    })
    await databaseService.expenseRecords.insertOne(expenseRecord)
    return APP_MESSAGES.ADD_EXPENSE_RECORD_SUCCESS
  }

  async deleteMoneyAccountService(payload: DeleteMoneyAccountReqBody) {
    const money_account_id = payload.money_account_id

    const query = {
      _id: new ObjectId(money_account_id),
      user_id: new ObjectId(payload.user_id)
    }
    const result = await databaseService.moneyAccounts.deleteOne(query)
    if (result['deletedCount'] == 1) {
      return {
        deletedCount: 1,
        msg: APP_MESSAGES.DELETE_MONEY_ACCOUNT_SUCCESS
      }
    } else
      return {
        deletedCount: 0,
        msg: APP_MESSAGES.MONEY_ACCOUNT_NOT_FOUND
      }
  }
  async updateMoneyAccount(payload: UpdateMoneyAccountReqBody) {
    // Chuyển report từ string sang number
    if (payload.report !== undefined && (payload.report.toString() === '0' || payload.report.toString() === '1')) {
      payload.report = parseInt(payload.report.toString())
    }
    /*
      Kiểm tra xem các số Decimal có không
      Có -> Dạng string chuyển thành Decimal128
      Không -> Giữ nguyên
    */
    const money_account_id = payload.money_account_id
    /*
      Tạo biến để chứa money_account_type_id (loại tài khoản tiền)
      -> Nếu req.body (payload) người dùng truyền không có money_account_type_id 
      -> Update nhưng không thay đổi loại tài khoản tiền
      -> Lấy từ database loại hiện tại đang dùng
    */
    let money_account_type_id: string = ''
    if (payload.money_account_type_id !== undefined) {
      // !== undefined là req.body có truyền -> người dùng có thay đổi loại tài khoản tiền
      money_account_type_id = payload.money_account_type_id.toString()
    } else {
      // Kiểm tra loại từ database
      const checkTypeId = await databaseService.moneyAccounts.findOne(
        { _id: new ObjectId(money_account_id) },
        { projection: { money_account_type_id: 1 } }
      )
      if (checkTypeId !== null) {
        money_account_type_id = checkTypeId.money_account_type_id.toString()
      }
    }
    /*
      Lấy money_account_type_id từ req.body (payload)
      -> Kiểm tra xem loại tài khoản tiền có phải là thẻ tín dụng không
        -> Nếu không thì set credit_limit_number = 0
        -> Phải set = 0 (trở về mặc định) vì nếu ban đầu là thẻ tín dụng thì mới có credit_limit_number
        -> Sau khi update nếu không là thẻ tín dụng thì không cần credit_limit_number
      -> Kiểm tra xem loại tài khoản tiền có phải là tài khoản ngân hàng, thẻ tín dụng không
        -> Nếu không thì set select_bank = ''
        -> Phải set = 0 (trở về mặc định) vì nếu ban đầu là tài khoản ngân hàng, thẻ tín dụng thì mới có select_bank
        -> Sau khi update nếu không là tài khoản ngân hàng, thẻ tín dụng thì không cần select_bank
    */
    const checkType = await databaseService.moneyAccountTypes.findOne(
      { _id: new ObjectId(money_account_type_id) },
      { projection: { name: 1 } }
    )
    if (checkType?.name !== 'Thẻ tín dụng') {
      payload.credit_limit_number = new Decimal128('0')
    }
    if (checkType?.name !== 'Tài khoản ngân hàng' && checkType?.name !== 'Thẻ tín dụng') {
      payload.select_bank = ''
    }
    // Xóa money_account_id khỏi _payload
    delete payload.money_account_id
    // Tìm và cập nhật tài khoản tiền theo money_account_id
    await databaseService.moneyAccounts.findOneAndUpdate(
      {
        _id: new ObjectId(money_account_id)
      },
      {
        $set: {
          ...payload
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return APP_MESSAGES.UPDATE_MONEY_ACCOUNT_SUCCESS
  }

  async getInfoMoneyAccount(money_account_id: string) {
    const result = await databaseService.moneyAccounts
      .aggregate([
        {
          $match: {
            _id: new ObjectId(money_account_id)
          }
        },
        {
          $lookup: {
            from: 'money_account_types',
            localField: 'money_account_type_id', // Trường trong moneyAccounts
            foreignField: '_id', // Trường trong money_account_types
            as: 'money_type_information' // Tên trường kết quả join
          }
        },
        {
          $unwind: '$money_type_information' // Dùng để "mở" mảng money_type_information ra để truy cập các trường bên trong.
        },
        {
          // Chỉ định các trường mà bạn muốn bao gồm trong kết quả cuối cùng
          $project: {
            _id: 1,
            name: 1,
            account_balance: 1,
            user_id: 1,
            money_account_type_id: 1,
            description: 1,
            report: 1,
            select_bank: 1,
            credit_limit_number: 1,
            'money_type_information.icon': 1,
            'money_type_information.name': 1
          }
        }
      ])
      .next() // Next để chỉ trả về 1 kết quả -> vì chắc chắn nó sẽ chỉ có 1 nên không dùng toArray()
    return result
  }
}

const appServices = new AppServices()
export default appServices
