import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schemas'
import MoneyAccount from '~/models/schemas/MoneyAccount.schemas'
import CashFlow from '~/models/schemas/CashFlow.schemas'
import CashFlowCategory from '~/models/schemas/CashFlowCategory.schemas'
import RefreshToken from '~/models/schemas/Refresh.schemas'
import MoneyAccountType from '~/models/schemas/MoneyAccountType.schemas'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@financialmanagement.kiplzgn.mongodb.net/`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get moneyAccountTypes(): Collection<MoneyAccountType> {
    return this.db.collection(process.env.DB_MONEY_ACCOUNT_TYPES_COLLECTION as string)
  }

  get moneyAccounts(): Collection<MoneyAccount> {
    return this.db.collection(process.env.DB_MONEY_ACCOUNTS_COLLECTION as string)
  }

  get cashFlows(): Collection<CashFlow> {
    return this.db.collection(process.env.DB_CASH_FLOWS_COLLECTION as string)
  }

  get cashFlowCategories(): Collection<CashFlowCategory> {
    return this.db.collection(process.env.DB_CASH_FLOW_CATEGORIES_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
