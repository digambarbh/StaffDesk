import express from 'express'
import authRouter from './routes/auth.js'

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

app.get('/health', (_req, res) => {
  res.send('Server is running Fine . All Ok.')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
