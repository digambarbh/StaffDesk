import express from 'express'
import authRouter from './routes/auth.js'
import session from 'express-session'
const app = express()

app.use(express.json())




app.get('/health', (_req, res) => {
  res.send('Server is running Fine . All Ok.')
})

app.use('/api/v1/auth', authRouter)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
