import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const GENERATION_QUEUE_NAME = 'assignment-generation';

export interface GenerationJobData {
  assignmentId: string;
}

export const generationQueue = new Queue<GenerationJobData>(GENERATION_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export async function addGenerationJob(assignmentId: string): Promise<void> {
  await generationQueue.add(
    'generate',
    { assignmentId },
    { jobId: `generation-${assignmentId}` }
  );
}

export async function removeGenerationJob(assignmentId: string): Promise<void> {
  const jobId = `generation-${assignmentId}`;
  const job = await generationQueue.getJob(jobId);
  if (job) {
    await job.remove();
  }
}

export async function closeGenerationQueue(): Promise<void> {
  await generationQueue.close();
}
