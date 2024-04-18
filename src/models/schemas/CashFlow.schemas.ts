import { ObjectId } from 'mongodb'

interface CashFlowType {
  _id: ObjectId
  icon: string
  name: string
  isCheck: number // 0: false, 1: true
}

export default class CashFlow {
  _id: ObjectId
  icon: string
  name: string
  isCheck: number // 0: false, 1: true

  constructor(cashFlowType: CashFlowType) {
    this._id = cashFlowType._id
    this.icon = cashFlowType.icon
    this.name = cashFlowType.name
    this.isCheck = cashFlowType.isCheck || 0
  }
}
