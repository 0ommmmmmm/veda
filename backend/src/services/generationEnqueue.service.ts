import { addGenerationJob } from '../queues/generation.queue';
import { emitGenerationEvent } from '../sockets/index';
import { getAssignmentById } from './assignment.service';
import {
  runGenerationForAssignment,
  failGeneration,
} from './generationRunner.service';

export interface EnqueueGenerationResult {
  ranSynchronously: boolean;
}

export async function enqueueGeneration(
  assignmentId: string
): Promise<EnqueueGenerationResult> {
  const existing = await getAssignmentById(assignmentId);
  if (
    existing?.generationStatus === 'completed' &&
    (existing.questionPaper?.sections?.length ?? 0) > 0
  ) {
    console.log(
      `[generation] skip enqueue, already completed assignmentId=${assignmentId}`
    );
    return { ranSynchronously: false };
  }

  if (existing?.generationStatus === 'processing') {
    console.log(
      `[generation] skip enqueue, already processing assignmentId=${assignmentId}`
    );
    return { ranSynchronously: false };
  }

  console.log(`[generation] queued assignmentId=${assignmentId}`);
  emitGenerationEvent(assignmentId, 'generation:queued', { assignmentId });

  try {
    await addGenerationJob(assignmentId);
    return { ranSynchronously: false };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Queue unavailable';
    console.warn(
      `[generation] queue failed for assignmentId=${assignmentId}, running synchronously: ${message}`
    );

    try {
      await runGenerationForAssignment(assignmentId);
    } catch (syncError) {
      await failGeneration(assignmentId, syncError);
      throw syncError;
    }

    return { ranSynchronously: true };
  }
}
