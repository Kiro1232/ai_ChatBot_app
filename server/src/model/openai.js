import { knowledgeBase } from '../data/knowledgeBase.js'

const restaurantContext = knowledgeBase.filter((entry) => entry.intent !== 'fallback')
  .map((entry) => `${entry.intent}: ${entry.answer}`).join('\n')

// Keep the prompt deliberately small: the restaurant FAQ is the source of truth,
// while the model only improves phrasing and handles natural-language variations.
export async function answerWithOpenAI(question, localAnswer) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 120,
      messages: [
        { role: 'system', content: `You are TableTalk, a concise restaurant concierge. Answer only from this FAQ. If the FAQ does not answer the question, say you can help with hours, reservations, menu, dietary options, directions, or takeout. Do not invent details.\n\nFAQ:\n${restaurantContext}` },
        { role: 'user', content: question },
      ],
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`OpenAI returned ${response.status}`)
  const data = await response.json()
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('OpenAI returned an empty answer')
  return { ...localAnswer, answer: text, source: 'TableTalk AI' }
}