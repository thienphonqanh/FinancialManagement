import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import User from '~/models/schemas/User.schemas'
import { RegisterReqBody } from '~/models/requests/User.requets'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { config } from 'dotenv'
import RefreshToken from '~/models/schemas/Refresh.schemas'

config()
class UsersService {
  async signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  async signRefreshToken(user_id: string, exp?: number) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  async signAccessAndRefeshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  async checkEmailExist(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())

    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token: email_verify_token,
        password: hashPassword(payload.password)
      })
    )

    const [accessToken, refreshToken] = await this.signAccessAndRefeshToken(user_id.toString())
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken,
        iat,
        exp
      })
    )
    return { accessToken, refreshToken }
  }
}

const usersService = new UsersService()
export default usersService
