import { ObjectId } from 'mongodb'
import { File, Fields } from 'formidable'

export interface CashflowReqBody {
  icon: File[]
  name: Fields<string>
}

export interface CashflowCategoryReqBody {
  icon: File[]
  name: Fields<string>
  cash_flow_id: ObjectId
  sub_category?: []
}

export interface MoneyAccountTypeReqBody {
  image: string
  name: string
}
export interface MoneyAccountReqBody {
  name: string
  account_balance: string
  user_id: ObjectId
  money_account_type_id: ObjectId
  description?: string // Optional
  report?: number // Optional
  select_bank?: number // Optional
  credit_limit_number?: string // Optional
}
