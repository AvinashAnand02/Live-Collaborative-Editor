# Live Collab AI - Demo

Quick demo project for a **Live Collaborative Editor** with:
- Tiptap editor
- y-webrtc for P2P collaboration
- Floating AI toolbar (select text → AI edit preview → confirm)
- Chat sidebar that sends messages to an AI route (mock if OPENAI_API_KEY not set)
- Simple Agent route using DuckDuckGo instant answers (demo)

## Run locally
1. `npm install`
2. Optionally set `OPENAI_API_KEY` in `.env.local` for real AI calls.
3. `npm run dev`
4. Visit `http://localhost:3000` (open in two browser windows to test collaboration).

## Notes
- This is a demo scaffold (no DB). Collaboration uses y-webrtc (P2P).
- If you want real OpenAI responses, set `OPENAI_API_KEY` in environment variables.