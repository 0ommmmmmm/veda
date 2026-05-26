import type {
  Assignment,
  CreateAssignmentPayload,
  GenerationStatus,
  QuestionPaper,
  QuestionType,
} from './types'

export interface AssignmentApiResponse {
  id: string
  title: string
  createdDate: string
  dueDate: string
  questionTypes: QuestionType[]
  instructions: string
  fileUrl?: string
  status: Assignment['status']
  totalQuestions: number
  totalMarks: number
  generationStatus?: GenerationStatus
  questionPaper?: QuestionPaper
  generationError?: string
}

export function normalizeAssignment(raw: AssignmentApiResponse): Assignment {
  return {
    id: raw.id,
    title: raw.title,
    createdDate: new Date(raw.createdDate),
    dueDate: new Date(raw.dueDate),
    questionTypes: raw.questionTypes,
    instructions: raw.instructions ?? '',
    fileUrl: raw.fileUrl,
    status: raw.status,
    totalQuestions: raw.totalQuestions,
    totalMarks: raw.totalMarks,
    generationStatus: raw.generationStatus,
    questionPaper: raw.questionPaper,
    generationError: raw.generationError,
  }
}

export function toCreatePayload(input: {
  title: string
  dueDate: Date
  questionTypes: QuestionType[]
  instructions?: string
}): CreateAssignmentPayload {
  return {
    title: input.title,
    dueDate: input.dueDate.toISOString(),
    questionTypes: input.questionTypes.map((qt) => ({
      id: qt.id,
      type: qt.type,
      count: qt.count,
      marksPerQuestion: qt.marksPerQuestion,
    })),
    ...(input.instructions ? { instructions: input.instructions } : {}),
  }
}
