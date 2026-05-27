# VedaAI

VedaAI is a full-stack assignment + question paper generator for teachers. Create an assignment with question distribution, then the backend generates a structured exam-style question paper using **Groq** (with safe mock fallback), persists it in **MongoDB**, and streams realtime generation status via **Socket.io** (with polling fallback on the frontend). The output can be exported as a PDF.

## Tech stack

- **Frontend**: Next.js App Router, React, Tailwind CSS, Zustand
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Redis + BullMQ, Socket.io
- **AI**: Groq (JSON-only output validated via Zod), mock fallback
- **PDF**: `html2canvas` + `jspdf` (printable area uses hex colors)

## Architecture (high level)

1. Frontend creates an assignment (`POST /api/assignments`)
2. Backend enqueues a BullMQ job (or runs synchronously if the queue is unavailable)
3. Worker generates a `questionPaper` (Groq or mock) and stores it on the assignment in MongoDB
4. Backend emits Socket.io events (`generation:*`)
5. Frontend listens for events and also polls while status is `queued`/`processing`
6. Output page renders a clean exam-paper layout and supports PDF download and manual regenerate

## Local setup

### 1) Start backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

### 2) Start frontend

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Run:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Environment variables

### Frontend

- `NEXT_PUBLIC_API_URL`: backend base URL (default `http://localhost:4000`)

### Backend

See `backend/.env.example`.

**Groq generation**

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.1-8b-instant
```

If `AI_PROVIDER=groq` but `GROQ_API_KEY` is missing, the backend automatically falls back to mock generation.

## Features implemented

- Assignment creation with validation (title, due date, question types)
- Realtime generation status (Socket.io) + polling fallback
- MongoDB persistence for assignments and generated papers
- BullMQ job processing with sync fallback when Redis is unavailable
- Exam-paper rendering UI and PDF export (`id="printable-content"`)
- Responsive UI (desktop sidebar + mobile bottom navigation)
- Settings + profile (saved in localStorage via Zustand)

## Build / production checks

Frontend:

```bash
npm run build
```

Backend:

```bash
cd backend
npm run build
```

## Deployment notes

- Frontend can be deployed as a standard Next.js app.
- Backend can be deployed as a Node service; ensure MongoDB and (optionally) Redis are available.
- If Redis is unavailable, generation still works via synchronous fallback.
