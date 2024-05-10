import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { config } from 'dotenv'
import CashFlowCategory, { CashFlowCategoryType } from '~/models/schemas/CashFlowCategory.schemas'
import CashFlowSubCategory, { CashFlowSubCategoryType } from '~/models/schemas/CashFlowSubCategory.schemas'

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
}

const appServices = new AppServices()
export default appServices
