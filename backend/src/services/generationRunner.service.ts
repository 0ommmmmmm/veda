import {
  getAssignmentById,
  updateGenerationStatus,
} from './assignment.service';
import { generateQuestionPaper } from './generation.service';
import { emitGenerationEvent } from '../sockets/index';

export async function runGenerationForAssignment(
  assignmentId: string
): Promise<void> {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  if (
    assignment.generationStatus === 'completed' &&
    assignment.questionPaper?.sections?.length
  ) {
    console.log(
      `[generation] skip already completed assignmentId=${assignmentId}`
    );
    return;
  }

  await updateGenerationStatus(assignmentId, 'processing', {
    clearGenerationError: true,
  });
  console.log(`[generation] processing assignmentId=${assignmentId}`);
  emitGenerationEvent(assignmentId, 'generation:processing', { assignmentId });

  const questionPaper = await generateQuestionPaper(assignment);

  await updateGenerationStatus(assignmentId, 'completed', {
    questionPaper,
    clearGenerationError: true,
  });

  console.log(
    `[generation] completed assignmentId=${assignmentId} questions=${questionPaper.totalQuestions}`
  );
  emitGenerationEvent(assignmentId, 'generation:completed', {
    assignmentId,
    questionPaper,
  });
}

export async function failGeneration(
  assignmentId: string,
  error: unknown
): Promise<void> {
  const message =
    error instanceof Error ? error.message : 'Generation failed';
  console.log(
    `[generation] failed assignmentId=${assignmentId} reason=${message}`
  );

  await updateGenerationStatus(assignmentId, 'failed', {
    generationError: message,
  });

  emitGenerationEvent(assignmentId, 'generation:failed', {
    assignmentId,
    error: message,
  });
}
