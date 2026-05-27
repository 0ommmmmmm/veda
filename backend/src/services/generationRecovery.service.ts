import { Assignment } from '../models/Assignment';
import type { GenerationStatus } from '../types/assignment.types';

const STALE_MS = 2 * 60 * 1000;
const IN_PROGRESS: GenerationStatus[] = ['queued', 'processing'];

export async function resetStaleGenerations(options?: {
  mode?: 'stale-only' | 'all-in-progress';
}): Promise<{ matched: number; modified: number }> {
  const mode = options?.mode ?? 'stale-only';
  const now = Date.now();
  const cutoff = new Date(now - STALE_MS);

  const query =
    mode === 'all-in-progress'
      ? { generationStatus: { $in: IN_PROGRESS } }
      : {
          generationStatus: { $in: IN_PROGRESS },
          updatedAt: { $lt: cutoff },
        };

  const result = await Assignment.updateMany(query, {
    $set: {
      generationStatus: 'failed',
      generationError: 'Generation interrupted. Please regenerate.',
    },
    $unset: { questionPaper: 1 },
  }).exec();

  return {
    matched: (result as any).matchedCount ?? (result as any).n ?? 0,
    modified: (result as any).modifiedCount ?? (result as any).nModified ?? 0,
  };
}

