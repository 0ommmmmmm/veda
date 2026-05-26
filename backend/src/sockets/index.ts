import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env';
import type { QuestionPaper } from '../types/assignment.types';

let io: Server | null = null;

export type GenerationEvent =
  | 'generation:queued'
  | 'generation:processing'
  | 'generation:completed'
  | 'generation:failed';

export function initSocketIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join-assignment', ({ assignmentId }: { assignmentId?: string }) => {
      if (!assignmentId || typeof assignmentId !== 'string') {
        return;
      }
      socket.join(getAssignmentRoom(assignmentId));
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

function getAssignmentRoom(assignmentId: string): string {
  return `assignment:${assignmentId}`;
}

export function emitGenerationEvent(
  assignmentId: string,
  event: GenerationEvent,
  payload: Record<string, unknown>
): void {
  if (!io) {
    return;
  }
  io.to(getAssignmentRoom(assignmentId)).emit(event, payload);
}

export function closeSocketIO(): void {
  if (io) {
    io.close();
    io = null;
  }
}

export type { QuestionPaper };
