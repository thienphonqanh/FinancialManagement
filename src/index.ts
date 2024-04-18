import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { config } from 'dotenv'
import databaseService from './services/database.services'
config()

const PORT = process.env.PORT
const app = express()
const httpServer = createServer(app)

databaseService.connect()

app.use(cors())
app.use(express.json()) // Kích hoạt middleware -> chuyển đổi json trong HTTP thành JS Object

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
