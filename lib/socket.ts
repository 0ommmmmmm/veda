import { io, Socket } from 'socket.io-client'
import type { QuestionPaper } from './types'

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export function connectSocket(): Socket {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export function joinAssignment(assignmentId: string): void {
  const s = connectSocket()
  s.emit('join-assignment', { assignmentId })
}

export function leaveAssignment(assignmentId: string): void {
  if (!socket?.connected) return
  socket.emit('leave-assignment', { assignmentId })
}

export type GenerationQueuedPayload = { assignmentId: string }
export type GenerationProcessingPayload = { assignmentId: string }
export type GenerationCompletedPayload = {
  assignmentId: string
  questionPaper: QuestionPaper
}
export type GenerationFailedPayload = {
  assignmentId: string
  error: string
}

export function onGenerationQueued(
  handler: (data: GenerationQueuedPayload) => void
): () => void {
  const s = getSocket()
  s.on('generation:queued', handler)
  return () => s.off('generation:queued', handler)
}

export function onGenerationProcessing(
  handler: (data: GenerationProcessingPayload) => void
): () => void {
  const s = getSocket()
  s.on('generation:processing', handler)
  return () => s.off('generation:processing', handler)
}

export function onGenerationCompleted(
  handler: (data: GenerationCompletedPayload) => void
): () => void {
  const s = getSocket()
  s.on('generation:completed', handler)
  return () => s.off('generation:completed', handler)
}

export function onGenerationFailed(
  handler: (data: GenerationFailedPayload) => void
): () => void {
  const s = getSocket()
  s.on('generation:failed', handler)
  return () => s.off('generation:failed', handler)
}
