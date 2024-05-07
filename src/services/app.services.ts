import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { config } from 'dotenv'

config()
class AppServices {
  async getCashFlow() {
    const data = await databaseService.cashFlows.find({}).toArray()
    return data
  }
}

const appServices = new AppServices()
export default appServices
