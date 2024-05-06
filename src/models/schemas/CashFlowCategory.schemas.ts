import { ObjectId } from 'mongodb'

interface CashFlowCategoryType {
  _id: ObjectId
  icon: string
  name: string
  cash_flow_id: ObjectId
  sub_category?: []
  created_at?: Date
  updated_at?: Date
}

export default class CashFlowCategory {
  _id: ObjectId
  icon: string
  name: string
  cash_flow_id: ObjectId
  sub_category: []
  created_at: Date
  updated_at: Date

  constructor(cashFlowCategoryType: CashFlowCategoryType) {
    const date = new Date()
    this._id = cashFlowCategoryType._id
    this.icon = cashFlowCategoryType.icon
    this.name = cashFlowCategoryType.name
    this.cash_flow_id = cashFlowCategoryType.cash_flow_id
    this.sub_category = cashFlowCategoryType.sub_category || []
    this.created_at = cashFlowCategoryType.created_at || date
    this.updated_at = cashFlowCategoryType.updated_at || date
  }
}
