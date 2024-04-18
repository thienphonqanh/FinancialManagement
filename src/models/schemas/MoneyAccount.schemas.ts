import { Decimal128, ObjectId } from 'mongodb'
import { IncludedReport } from '~/constants/enums'

interface MoneyAccountType {
  _id?: ObjectId
  name: string
  account_balance: Decimal128
  money_account_type: ObjectId[]
  created_at: Date
  updated_at?: Date
  description?: string // Optional
  not_included_report?: IncludedReport // Optional
  select_bank?: number // Optional
  credit_limit_number?: Decimal128 // Optional
}

export default class MoneyAccount {
  _id?: ObjectId
  name: string
  account_balance: Decimal128
  money_account_type: ObjectId[]
  created_at: Date
  updated_at: Date
  description: string // Optional
  not_included_report: IncludedReport // Optional
  select_bank: number // Optional
  credit_limit_number: Decimal128 // Optional

  constructor(moneyAccountType: MoneyAccountType) {
    const date = new Date()
    this._id = moneyAccountType._id || new ObjectId()
    this.name = moneyAccountType.name
    this.account_balance = moneyAccountType.account_balance
    this.money_account_type = moneyAccountType.money_account_type || []
    this.description = moneyAccountType.description || ''
    this.created_at = moneyAccountType.created_at || date
    this.updated_at = moneyAccountType.updated_at || date
    this.not_included_report = moneyAccountType.not_included_report || IncludedReport.NotIncluded
    this.select_bank = moneyAccountType.select_bank || 0
    this.credit_limit_number = moneyAccountType.credit_limit_number || new Decimal128('0')
  }
}
