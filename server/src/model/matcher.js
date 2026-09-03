import { knowledgeBase } from '../data/knowledgeBase.js'

const stopWords = new Set(['a', 'an', 'are', 'can', 'do', 'how', 'i', 'is', 'my', 'of', 'the', 'to', 'what', 'where', 'you'])
const tokenize = (text) => text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((word) => word && !stopWords.has(word))

// A deterministic local classifier keeps fixed FAQ answers fast, private, and explainable.
export function answerQuestion(question) {
  if (typeof question !== 'string' || !question.trim()) throw new TypeError('A non-empty question is required.')
  const inputTokens = new Set(tokenize(question))
  let bestMatch = knowledgeBase.at(-1)
  let bestScore = 0
  for (const entry of knowledgeBase.slice(0, -1)) {
    const score = Math.max(...entry.questions.map((example) => {
      const tokens = tokenize(example)
      return tokens.reduce((total, token) => total + (inputTokens.has(token) ? 1 : 0), 0) / tokens.length
    }))
    if (score > bestScore) { bestScore = score; bestMatch = entry }
  }
  return { ...bestMatch, confidence: bestMatch.intent === 'fallback' ? 0.18 : Math.min(0.98, Math.max(0.64, 0.62 + bestScore)) }
}