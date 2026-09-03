import { useState } from 'react'
import './App.css'

const suggestedQuestions = ['What are your hours?', 'Do you have vegan options?', 'How do I book a table?']
const initialMessages = [{ id: 1, role: 'bot', text: 'Welcome to TableTalk. I can help you plan a visit, find a dish, or make a reservation.', meta: 'Ready to help' }]

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [question, setQuestion] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function sendQuestion(event, suggestedQuestion = question) {
    event?.preventDefault()
    const text = suggestedQuestion.trim()
    if (!text || isSending) return
    setQuestion('')
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text }])
    setIsSending(true)
    try {
      const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '')
      const apiUrl = configuredApiUrl ? `${configuredApiUrl}/api/chat` : '/api/chat'
      const response = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text }),
      })
      const answer = await response.json()
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'bot', text: answer.answer, meta: `${answer.source} · ${Math.round(answer.confidence * 100)}% match` }])
    } catch {
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'bot', text: 'I could not reach the kitchen right now. Please try again in a moment.', meta: 'Connection issue' }])
    } finally { setIsSending(false) }
  }

  return (
    <main className="app-shell">
      <header className="topbar"><a className="brand" href="/" aria-label="TableTalk home"><span className="brand-mark">T</span><span>tabletalk</span></a><div className="status"><span className="status-dot" /> <span>Kitchen online</span></div></header>
      <section className="workspace">
        <div className="intro"><p className="eyebrow">Guest concierge · 01</p><h1>Good food starts<br /><em>with a question.</em></h1><p className="intro-copy">A little help from our table to yours. Ask about the menu, book a seat, or find your way over.</p><div className="hours-strip"><span className="hours-icon">◷</span><span><strong>Open today</strong><br />11:30 AM — 10:00 PM</span></div></div>
        <div className="chat-panel" data-testid="chat-panel"><div className="chat-heading"><div><p className="eyebrow">Your host</p><h2>Ask TableTalk</h2></div><span className="bot-avatar">✦</span></div><div className="messages" data-testid="message-list" aria-live="polite">{messages.map((message) => <div className={`message-row ${message.role}`} key={message.id}><div className="message"><p>{message.text}</p><small>{message.meta}</small></div></div>)}{isSending && <div className="message-row bot"><div className="message typing" data-testid="typing-indicator"><span /><span /><span /></div></div>}</div><div className="suggestions"><p>Try asking</p>{suggestedQuestions.map((suggestion) => <button type="button" data-testid="suggested-question" key={suggestion} onClick={(event) => sendQuestion(event, suggestion)}>{suggestion} <span>↗</span></button>)}</div><form className="composer" onSubmit={sendQuestion}><input data-testid="question-input" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about TableTalk..." aria-label="Ask TableTalk a question" /><button data-testid="send-button" type="submit" disabled={isSending || !question.trim()} aria-label="Send question">↑</button></form></div>
      </section>
      <footer><span>18 Mercer Street · SoHo, New York</span><span>Seasonal cooking, served simply.</span></footer>
    </main>
  )
}

export default App
