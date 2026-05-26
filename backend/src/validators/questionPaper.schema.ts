import { randomUUID } from 'crypto';
import { z } from 'zod';
import type { IAssignment } from '../models/Assignment';
import type { QuestionPaper, QuestionType } from '../types/assignment.types';

export const questionTypeEnum = z.enum([
  'MCQ',
  'Short Answer',
  'Essay',
  'Fill in the Blank',
  'Matching',
  'True/False',
]);

export const difficultyEnum = z.enum(['Easy', 'Moderate', 'Challenging']);

export const questionTypeRowSchema = z.object({
  id: z.string(),
  type: questionTypeEnum,
  count: z.number().int().min(0),
  marksPerQuestion: z.number().int().min(0),
});

export const generatedQuestionSchema = z.object({
  id: z.string().optional(),
  number: z.number().int().positive(),
  text: z.string().min(1).max(2000),
  marks: z.number().int().min(0),
  difficulty: difficultyEnum,
  options: z.array(z.string().max(500)).optional(),
});

export const generatedSectionSchema = z.object({
  sectionLabel: z.string().max(10),
  questionType: questionTypeRowSchema,
  questions: z.array(generatedQuestionSchema).min(1),
});

/** AI may omit server-owned fields; those are filled in parseAndValidateQuestionPaper */
export const aiQuestionPaperSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  instructions: z.string().max(5000).optional(),
  totalQuestions: z.number().int().min(0).optional(),
  totalMarks: z.number().int().min(0).optional(),
  sections: z.array(generatedSectionSchema).min(1),
});

export const questionPaperSchema = z.object({
  assignmentId: z.string(),
  title: z.string().min(1).max(500),
  instructions: z.string().max(5000),
  totalQuestions: z.number().int().min(0),
  totalMarks: z.number().int().min(0),
  generatedAt: z.string(),
  sections: z.array(generatedSectionSchema),
});

function activeQuestionTypes(assignment: IAssignment): QuestionType[] {
  return assignment.questionTypes.filter((qt) => qt.count > 0);
}

function validateMcqOptions(
  sections: z.infer<typeof generatedSectionSchema>[]
): string | null {
  for (const section of sections) {
    if (section.questionType.type !== 'MCQ') continue;
    for (const q of section.questions) {
      if (!q.options || q.options.length !== 4) {
        return `MCQ question "${q.text.slice(0, 40)}..." must have exactly 4 options`;
      }
    }
  }
  return null;
}

function validateBusinessRules(
  paper: z.infer<typeof questionPaperSchema>,
  assignment: IAssignment
): string | null {
  const expectedTypes = activeQuestionTypes(assignment);

  if (paper.sections.length !== expectedTypes.length) {
    return `Expected ${expectedTypes.length} sections, got ${paper.sections.length}`;
  }

  for (let i = 0; i < expectedTypes.length; i++) {
    const expected = expectedTypes[i]!;
    const section = paper.sections[i]!;

    if (section.questionType.type !== expected.type) {
      return `Section ${section.sectionLabel} type mismatch`;
    }
    if (section.questions.length !== expected.count) {
      return `Section ${section.sectionLabel} expected ${expected.count} questions, got ${section.questions.length}`;
    }

    for (const q of section.questions) {
      if (q.marks !== expected.marksPerQuestion) {
        return `Question marks must be ${expected.marksPerQuestion}`;
      }
    }
  }

  if (paper.totalQuestions !== assignment.totalQuestions) {
    return `totalQuestions mismatch`;
  }
  if (paper.totalMarks !== assignment.totalMarks) {
    return `totalMarks mismatch`;
  }

  return validateMcqOptions(paper.sections);
}

function normalizeSections(
  sections: z.infer<typeof generatedSectionSchema>[],
  assignment: IAssignment
): QuestionPaper['sections'] {
  const expectedTypes = activeQuestionTypes(assignment);

  return sections.map((section, index) => {
    const questionType = expectedTypes[index] ?? section.questionType;
    const questions = section.questions.map((q, qIndex) => ({
      id: q.id ?? randomUUID(),
      number: qIndex + 1,
      text: q.text.trim(),
      marks: questionType.marksPerQuestion,
      difficulty: q.difficulty,
      ...(questionType.type === 'MCQ' && q.options
        ? { options: q.options.map((o) => o.trim()) }
        : {}),
    }));

    return {
      sectionLabel: section.sectionLabel || String.fromCharCode(65 + index),
      questionType: {
        id: questionType.id,
        type: questionType.type,
        count: questionType.count,
        marksPerQuestion: questionType.marksPerQuestion,
      },
      questions,
    };
  });
}

export function parseAndValidateQuestionPaper(
  raw: unknown,
  assignment: IAssignment
): QuestionPaper {
  const aiParsed = aiQuestionPaperSchema.safeParse(raw);
  if (!aiParsed.success) {
    throw new Error(`Invalid question paper shape: ${aiParsed.error.message}`);
  }

  const normalized: z.infer<typeof questionPaperSchema> = {
    assignmentId: assignment._id.toString(),
    title: aiParsed.data.title ?? assignment.title,
    instructions: aiParsed.data.instructions ?? assignment.instructions,
    totalQuestions: aiParsed.data.totalQuestions ?? assignment.totalQuestions,
    totalMarks: aiParsed.data.totalMarks ?? assignment.totalMarks,
    generatedAt: new Date().toISOString(),
    sections: normalizeSections(aiParsed.data.sections, assignment),
  };

  const fullParsed = questionPaperSchema.safeParse(normalized);
  if (!fullParsed.success) {
    throw new Error(`Question paper validation failed: ${fullParsed.error.message}`);
  }

  const businessError = validateBusinessRules(fullParsed.data, assignment);
  if (businessError) {
    throw new Error(businessError);
  }

  return fullParsed.data as QuestionPaper;
}

export function validateMockQuestionPaper(
  paper: QuestionPaper,
  assignment: IAssignment
): QuestionPaper {
  return parseAndValidateQuestionPaper(paper, assignment);
}
