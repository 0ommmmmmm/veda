import http from 'http';
import app from './app';
import { env, getGenerationModeLabel } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';
import { redisConnection } from './config/redis';
import { initSocketIO, closeSocketIO } from './sockets/index';
import { startGenerationWorker, closeGenerationWorker } from './workers/generation.worker';
import { closeGenerationQueue } from './queues/generation.queue';
import { resetStaleGenerations } from './services/generationRecovery.service';

const httpServer = http.createServer(app);

initSocketIO(httpServer);

async function shutdown(): Promise<void> {
  console.log('Shutting down...');
  await closeGenerationWorker();
  await closeGenerationQueue();
  closeSocketIO();
  await disconnectDatabase();
  redisConnection.disconnect();
  httpServer.close();
  process.exit(0);
}

async function bootstrap(): Promise<void> {
  await connectDatabase();

  // Reset stale queued/processing assignments so UI can recover
  try {
    const { matched, modified } = await resetStaleGenerations({
      mode: 'stale-only',
    });
    if (matched > 0) {
      console.log(
        `[generation] recovered stale in-progress assignments matched=${matched} modified=${modified}`
      );
    }
  } catch (err) {
    console.warn(
      `[generation] failed to recover stale assignments on startup: ${
        err instanceof Error ? err.message : 'unknown error'
      }`
    );
  }

  startGenerationWorker();

  httpServer.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
    console.log(`Health: http://localhost:${env.PORT}/health`);
    console.log(`API: http://localhost:${env.PORT}/api/assignments`);
    console.log(`Question generation mode: ${getGenerationModeLabel()}`);
  });
}

process.on('SIGTERM', () => {
  void shutdown();
});
process.on('SIGINT', () => {
  void shutdown();
});

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
