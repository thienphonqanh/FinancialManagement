import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import usersRouter from './routes/users.routes'
import adminsRouter from './routes/admins.routes'
import { initFolder } from './utils/file'
import appsRouter from './routes/app.routes'
import { envConfig } from './constants/configs'

const PORT = envConfig.port
const app = express()
const httpServer = createServer(app)

databaseService.connect()

app.use(cors())
initFolder()
app.use(express.json()) // Kích hoạt middleware -> chuyển đổi json trong HTTP thành JS Object
app.use('/users', usersRouter) // Route cho người dùng
app.use('/admins', adminsRouter) // Route cho quản trị viên
app.use('/app', appsRouter) // Route cho quản trị viên
app.use(defaultErrorHandler) // Middleware xử lý lỗi mặc định

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
