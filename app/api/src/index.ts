import express from 'express'
import authRouter from './routes/auth.js'
import session from 'express-session'
import { sessionMiddleware } from "./config/sessionConfig.js"
const app = express()

app.use(express.json())
app.use(sessionMiddleware);



app.get('/health', (req, res) => {
  res.send('Server is running Fine . All Ok.')
})

app.use('/api/v1/auth', authRouter)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
