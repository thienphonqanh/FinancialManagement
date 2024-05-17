import { Decimal128, ObjectId } from 'mongodb'
import { IncludedReport } from '~/constants/enums'

interface ExpenseRecordType {
  _id?: ObjectId
  amount_of_money: Decimal128 // Số tiền
  cash_flow_id: ObjectId // Dòng tiền
  cash_flow_category_id: ObjectId // Hạng mục chi tiêu
  money_account_id: ObjectId // Chọn tài khoản tiền
  user_id: ObjectId // ID người dùng
  description?: string // Mô tả (Optional)
  occur_date?: Date // Ngày xảy ra (Optional)
  trip_or_event?: string // Chuyến đi hoặc sự kiện (Optional)
  location?: string // Địa điểm (Optional)
  report?: IncludedReport // Tính vào báo cáo (Optional)
  pay_for_who?: string // Trả cho ai (Optional)
  collect_from_who?: string // Thu từ ai (Optional)
  borrow_from_who?: string // Mượn từ ai (Optional)
  repayment_date?: Date // Ngày trả nợ (Optional)
  cost_incurred?: Decimal128 // Chi phí phát sinh (Optional)
  cost_incurred_category_id?: ObjectId | string // Hạng mục chi phí phát sinh (Required nếu có chọn chi phí phát sinh)
  debtor?: string // Người nợ (Optional)
  debt_collection_date?: Date // Ngày thu nợ (Optional)
  transfer_to_account_id?: ObjectId | string // Chuyển vào tài khoản (Required nếu có chọn chuyển khoản)
  proof_image?: string // Hình ảnh chứng minh (Optional)
  created_at?: Date
  updated_at?: Date
}

export default class ExpenseRecord {
  _id?: ObjectId
  amount_of_money: Decimal128
  cash_flow_id: ObjectId
  cash_flow_category_id: ObjectId
  money_account_id: ObjectId
  user_id: ObjectId
  description: string
  occur_date: Date
  trip_or_event: string
  location: string
  report: IncludedReport
  pay_for_who: string
  collect_from_who: string
  borrow_from_who: string
  repayment_date: Date
  cost_incurred: Decimal128
  cost_incurred_category_id: ObjectId | string
  debtor: string
  debt_collection_date: Date
  transfer_to_account_id: ObjectId | string
  proof_image: string
  created_at: Date
  updated_at: Date

  constructor(expenseRecordType: ExpenseRecordType) {
    const date = new Date()
    this._id = expenseRecordType._id || new ObjectId()
    this.amount_of_money = expenseRecordType.amount_of_money
    this.cash_flow_id = expenseRecordType.cash_flow_id
    this.cash_flow_category_id = expenseRecordType.cash_flow_category_id
    this.money_account_id = expenseRecordType.money_account_id
    this.user_id = expenseRecordType.user_id || ''
    this.description = expenseRecordType.description || ''
    this.occur_date = expenseRecordType.occur_date || date
    this.trip_or_event = expenseRecordType.trip_or_event || ''
    this.location = expenseRecordType.location || ''
    this.report = expenseRecordType.report || IncludedReport.Included
    this.pay_for_who = expenseRecordType.pay_for_who || ''
    this.collect_from_who = expenseRecordType.collect_from_who || ''
    this.borrow_from_who = expenseRecordType.borrow_from_who || ''
    this.repayment_date = expenseRecordType.repayment_date || date
    this.cost_incurred = expenseRecordType.cost_incurred || new Decimal128('0')
    this.cost_incurred_category_id = expenseRecordType.cost_incurred_category_id || ''
    this.debtor = expenseRecordType.debtor || ''
    this.debt_collection_date = expenseRecordType.debt_collection_date || date
    this.transfer_to_account_id = expenseRecordType.transfer_to_account_id || ''
    this.proof_image = expenseRecordType.proof_image || ''
    this.created_at = expenseRecordType.created_at || date
    this.updated_at = expenseRecordType.updated_at || date
  }
}
