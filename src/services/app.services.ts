import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { config } from 'dotenv'
import CashFlowCategory from '~/models/schemas/CashFlowCategory.schemas'
import CashFlowSubCategory from '~/models/schemas/CashFlowSubCategory.schemas'

config()
class AppServices {
  async getCashFlow() {
    const data = await databaseService.cashFlows.find({}).toArray()
    return data
  }

  async getCashFlowCategory() {
    const result: CashFlowCategory[] = await databaseService.cashFlowCategories.find({}).toArray()
    const transformResult = result.map((item) => ({
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
    }))

    return transformResult
  }
}

const appServices = new AppServices()
export default appServices
