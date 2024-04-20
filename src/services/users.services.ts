import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import User from '~/models/schemas/User.schemas'
import { RegisterReqBody } from '~/models/requests/User.requets'
import { hashPassword } from '~/utils/crypto'

class UsersService {
  async checkEmailExist(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()

    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        password: hashPassword(payload.password)
      })
    )

    return user_id
  }
}

const usersService = new UsersService()
export default usersService
