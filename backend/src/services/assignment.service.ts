import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { Assignment, IAssignment } from '../models/Assignment';
import type { CreateAssignmentInput } from '../validators/assignment.schema';
import type { GenerationStatus, QuestionPaper, QuestionType } from '../types/assignment.types';

function computeTotals(questionTypes: QuestionType[]) {
  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
  const totalMarks = questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marksPerQuestion,
    0
  );
  return { totalQuestions, totalMarks };
}

function normalizeQuestionTypes(
  questionTypes: CreateAssignmentInput['questionTypes']
): QuestionType[] {
  return questionTypes.map((qt) => ({
    id: qt.id ?? randomUUID(),
    type: qt.type,
    count: qt.count,
    marksPerQuestion: qt.marksPerQuestion,
  }));
}

export async function createAssignment(
  input: CreateAssignmentInput
): Promise<IAssignment> {
  const questionTypes = normalizeQuestionTypes(input.questionTypes);
  const { totalQuestions, totalMarks } = computeTotals(questionTypes);

  const assignment = await Assignment.create({
    title: input.title,
    schoolName: input.schoolName,
    subject: input.subject,
    className: input.className,
    dueDate: input.dueDate,
    createdDate: new Date(),
    questionTypes,
    instructions: input.instructions ?? '',
    status: 'draft',
    totalQuestions,
    totalMarks,
    generationStatus: 'queued',
  });

  return assignment;
}

export async function listAssignments(): Promise<IAssignment[]> {
  return Assignment.find().sort({ createdDate: -1 }).exec();
}

export async function getAssignmentById(id: string): Promise<IAssignment | null> {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return Assignment.findById(id).exec();
}

export async function deleteAssignmentById(id: string): Promise<boolean> {
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }
  const result = await Assignment.findByIdAndDelete(id).exec();
  return result !== null;
}

export async function updateGenerationStatus(
  id: string,
  generationStatus: GenerationStatus,
  extras?: {
    questionPaper?: QuestionPaper;
    generationError?: string;
    clearQuestionPaper?: boolean;
    clearGenerationError?: boolean;
  }
): Promise<IAssignment | null> {
  const $set: Record<string, unknown> = { generationStatus };
  const $unset: Record<string, 1> = {};

  if (extras?.questionPaper !== undefined) {
    $set.questionPaper = extras.questionPaper;
  }
  if (extras?.generationError !== undefined) {
    $set.generationError = extras.generationError;
  }
  if (extras?.clearQuestionPaper) {
    $unset.questionPaper = 1;
  }
  if (extras?.clearGenerationError) {
    $unset.generationError = 1;
  }

  const update: Record<string, unknown> = { $set };
  if (Object.keys($unset).length > 0) {
    update.$unset = $unset;
  }

  return Assignment.findByIdAndUpdate(id, update, {
    returnDocument: 'after',
  }).exec();
}

export async function prepareRegeneration(id: string): Promise<IAssignment | null> {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Assignment.findByIdAndUpdate(
    id,
    {
      generationStatus: 'queued',
      $unset: { questionPaper: 1, generationError: 1 },
    },
    { returnDocument: 'after' }
  ).exec();
}
