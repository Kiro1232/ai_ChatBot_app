import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { answerQuestion } from './model/matcher.js'
import { answerWithOpenAI } from './model/openai.js'

const app = express()
const port = process.env.PORT || 3001
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim())
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.post('/api/chat', async (request, response) => {
  const question = typeof request.body?.question === 'string' ? request.body.question.trim() : ''
  if (!question || question.length > 500) return response.status(400).json({ error: 'Question must be between 1 and 500 characters.' })
  const localAnswer = answerQuestion(question)
  if (!process.env.OPENAI_API_KEY) return response.json(localAnswer)
  try {
    return response.json(await answerWithOpenAI(question, localAnswer))
  } catch (error) {
    console.error('OpenAI request failed; using local answer:', error.message)
    return response.json(localAnswer)
  }
})
// Bind on all interfaces so localhost works from browsers and forwarded container ports.
app.listen(port, '0.0.0.0', () => console.log(`TableTalk API listening on http://localhost:${port}`))