import express from 'express'
import authRouter from './routes/auth.js'
import employeeRouter from './routes/employee.js'
import { sessionMiddleware } from "./config/sessionConfig.js"
const app = express()

const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:5173"

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", webOrigin)
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")

  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }

  next()
})

app.use(express.json())
app.use(sessionMiddleware);



app.get('/health', (req, res) => {
  res.send('Server is running Fine . All Ok.')
})

app.use('/api/v1/auth', authRouter)

app.use('/api/v1/employee',employeeRouter)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
