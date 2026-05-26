import { isAiGenerationEnabled } from '../config/env';
import type { IAssignment } from '../models/Assignment';
import type { QuestionPaper } from '../types/assignment.types';
import { validateMockQuestionPaper } from '../validators/questionPaper.schema';
import { generateAiQuestionPaper } from './aiGeneration.service';
import { generateMockQuestionPaper } from './mockGeneration.service';

export async function generateQuestionPaper(
  assignment: IAssignment
): Promise<QuestionPaper> {
  if (isAiGenerationEnabled()) {
    try {
      const paper = await generateAiQuestionPaper(assignment);
      console.log(
        `[generation] AI question paper created for assignment ${assignment._id.toString()}`
      );
      return paper;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'AI generation failed';
      console.warn(
        `[generation] AI failed, falling back to mock: ${message}`
      );
    }
  }

  const mockPaper = generateMockQuestionPaper(assignment);

  if (mockPaper.sections.length === 0) {
    throw new Error('Mock generation produced no sections');
  }

  try {
    return validateMockQuestionPaper(mockPaper, assignment);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Validation failed';
    console.warn(
      `[generation] mock validation skipped, using raw paper: ${message}`
    );
    return mockPaper;
  }
}
