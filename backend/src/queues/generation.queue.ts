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
  const jobId = `generate-${assignmentId}`;
  const existing = await generationQueue.getJob(jobId);
  if (existing) {
    const state = await existing.getState().catch(() => 'unknown');
    // If a job is already waiting/active/delayed, don't enqueue duplicates
    if (state !== 'completed' && state !== 'failed') {
      return;
    }
  }

  await generationQueue.add('generate', { assignmentId }, { jobId });
}

export async function hasActiveGenerationJob(
  assignmentId: string
): Promise<boolean> {
  const jobId = `generate-${assignmentId}`;
  const job = await generationQueue.getJob(jobId);
  if (!job) return false;
  const state = await job.getState().catch(() => 'unknown');
  return (
    state === 'active' ||
    state === 'waiting' ||
    state === 'delayed' ||
    state === 'waiting-children'
  );
}

export async function removeGenerationJob(assignmentId: string): Promise<void> {
  const jobId = `generate-${assignmentId}`;
  const job = await generationQueue.getJob(jobId);
  if (job) {
    await job.remove();
  }
}

export async function closeGenerationQueue(): Promise<void> {
  await generationQueue.close();
}
