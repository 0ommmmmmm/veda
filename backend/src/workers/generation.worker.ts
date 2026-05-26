import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import {
  GENERATION_QUEUE_NAME,
  type GenerationJobData,
} from '../queues/generation.queue';
import {
  runGenerationForAssignment,
  failGeneration,
} from '../services/generationRunner.service';

let worker: Worker<GenerationJobData> | null = null;

export function startGenerationWorker(): Worker<GenerationJobData> {
  worker = new Worker<GenerationJobData>(
    GENERATION_QUEUE_NAME,
    async (job) => {
      const assignmentId = job.data.assignmentId;
      try {
        await runGenerationForAssignment(assignmentId);
      } catch (error) {
        await failGeneration(assignmentId, error);
        throw error;
      }
    },
    { connection: redisConnection }
  );

  worker.on('failed', (job, err) => {
    console.error(`Generation job ${job?.id} failed:`, err.message);
  });

  console.log('Generation worker started');
  return worker;
}

export async function closeGenerationWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
    console.log('Generation worker stopped');
  }
}
