# VedaAI Backend (Phase 2)

Node.js + Express + TypeScript API with MongoDB, Redis, BullMQ job queue, and Socket.io for realtime assignment generation events.

## Prerequisites

- Node.js 20+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a cloud URI)
- [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) running locally

### macOS (Homebrew)

```bash
brew install mongodb-community redis
brew services start mongodb-community
brew services start redis
```

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The server starts on `http://localhost:4000` by default.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API + BullMQ worker with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |

## Health check

```bash
curl http://localhost:4000/health
```

## API

Base path: `/api/assignments`

### Create assignment

```bash
curl -X POST http://localhost:4000/api/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mathematics Final Exam",
    "dueDate": "2026-12-15T00:00:00.000Z",
    "questionTypes": [
      { "id": "q1", "type": "MCQ", "count": 5, "marksPerQuestion": 4 },
      { "id": "q2", "type": "Short Answer", "count": 3, "marksPerQuestion": 8 }
    ],
    "instructions": "Attempt all questions."
  }'
```

Returns `201` with the assignment (`generationStatus: queued`). A background worker generates a mock question paper within a few seconds.

### List assignments

```bash
curl http://localhost:4000/api/assignments
```

### Get assignment by ID

```bash
curl http://localhost:4000/api/assignments/<id>
```

### Delete assignment

```bash
curl -X DELETE http://localhost:4000/api/assignments/<id>
```

### Regenerate question paper

```bash
curl -X POST http://localhost:4000/api/assignments/<id>/regenerate
```

## WebSocket events (Socket.io)

Connect to `http://localhost:4000`, then join an assignment room:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');
const assignmentId = '<your-assignment-id>';

socket.emit('join-assignment', { assignmentId });

socket.on('generation:queued', (data) => console.log('queued', data));
socket.on('generation:processing', (data) => console.log('processing', data));
socket.on('generation:completed', (data) => console.log('completed', data));
socket.on('generation:failed', (data) => console.log('failed', data));
```

| Event | Payload |
|-------|---------|
| `generation:queued` | `{ assignmentId }` |
| `generation:processing` | `{ assignmentId }` |
| `generation:completed` | `{ assignmentId, questionPaper }` |
| `generation:failed` | `{ assignmentId, error }` |

## Project structure

```
src/
├── config/       # env, MongoDB, Redis
├── models/       # Mongoose schemas
├── validators/   # Zod request schemas
├── routes/       # Express routers
├── controllers/  # HTTP handlers
├── services/     # Business logic + mock generation
├── queues/       # BullMQ queue
├── workers/      # BullMQ worker
├── sockets/      # Socket.io setup
├── middleware/   # Error handling
├── utils/        # Response serializers
├── app.ts        # Express app
└── server.ts     # Entry point
```

## AI question generation (Phase 4)

Set in `.env`:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
```

| `AI_PROVIDER` | `GROQ_API_KEY` | Behavior |
|---------------|------------------|----------|
| `mock` | any | Always uses mock templates |
| `groq` | set | Groq generates structured JSON, validated with Zod |
| `groq` | empty | Falls back to mock (safe default) |

Setup steps:

1. Get a free Groq API key from [Groq Console](https://console.groq.com/keys).
2. Add `GROQ_API_KEY` to `backend/.env`.
3. Restart the backend.
4. Confirm startup log says `Question generation mode: groq (llama-3.1-8b-instant)`.

## Notes

- The worker runs in the same process as the API during development (`npm run dev`).
- For production, consider running the worker as a separate process.
