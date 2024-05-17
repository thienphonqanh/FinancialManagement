import { ObjectId } from 'mongodb'

export interface CashflowReqBody {
  icon: string
  name: string
}

export interface CashflowCategoryReqBody {
  icon: string
  name: string
  cash_flow_id: ObjectId
  parent_id: ObjectId
  sub_category?: []
  cash_flow_type?: number
}

export interface MoneyAccountTypeReqBody {
  icon: string
  name: string
}
