import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
config()

const PORT = process.env.PORT
const app = express()
const httpServer = createServer(app)

databaseService.connect()

app.use(cors())
app.use(express.json()) // Kích hoạt middleware -> chuyển đổi json trong HTTP thành JS Object
app.use(defaultErrorHandler) // Middleware xử lý lỗi mặc định

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
