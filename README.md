# TableTalk Restaurant Chatbot

A simple, private restaurant concierge built with React and Node.js. The API uses a curated FAQ training set and a deterministic keyword-scoring intent matcher, so it is fast and explainable without an external AI key or database.

## Structure

- `client/` - Vite + React chat interface
- `server/src/data/` - restaurant training data and answers
- `server/src/model/` - intent matching logic
- `server/src/index.js` - Express API

## Run locally

```bash
npm install
npm install --prefix server
cp server/.env.example server/.env
npm run dev
```

Open `http://localhost:5173`. In development, the client uses Vite to proxy `/api` to the backend at `http://localhost:3001`.

Keep both processes running while using the chat. If the browser reports `ERR_CONNECTION_REFUSED` for port `3001`, start the backend with `npm run dev --prefix server` or start both services with `npm run dev` from the repository root.

The client production bundle can be checked with `npm run build`. Add or edit restaurant intents in `server/src/data/knowledgeBase.js` and restart the server to retrain the local model.

Run the automated checks with:

```bash
npm run lint --prefix client
npm run build
npm test --prefix server
```

The chat UI exposes `data-testid` hooks for `chat-panel`, `message-list`, `question-input`, `send-button`, `suggested-question`, and `typing-indicator`.

## OpenAI configuration

Put `OPENAI_API_KEY` in `server/.env`; it is read only by the backend and `.env` files are ignored by git. The optional provider uses `gpt-4o-mini`, a compact prompt, low temperature, and a 120-token output limit. OpenAI API usage is not generally free, so the app automatically uses the local FAQ matcher when the key is empty or an OpenAI request fails. The client only receives answers and never receives the key.