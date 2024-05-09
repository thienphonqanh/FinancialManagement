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
