export type QuestionTypeEnum =
  | 'MCQ'
  | 'Short Answer'
  | 'Essay'
  | 'Fill in the Blank'
  | 'Matching'
  | 'True/False'

export interface QuestionType {
  id: string
  type: QuestionTypeEnum
  count: number
  marksPerQuestion: number
}

export type AssignmentStatus = 'draft' | 'published' | 'completed'

export type GenerationStatus = 'queued' | 'processing' | 'completed' | 'failed'

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging'

export interface GeneratedQuestion {
  id: string
  number: number
  text: string
  marks: number
  difficulty: Difficulty
  options?: string[]
}

export interface GeneratedSection {
  sectionLabel: string
  questionType: QuestionType
  questions: GeneratedQuestion[]
}

export interface QuestionPaper {
  assignmentId: string
  title: string
  instructions: string
  totalQuestions: number
  totalMarks: number
  generatedAt: string
  sections: GeneratedSection[]
}

export interface Assignment {
  id: string
  title: string
  schoolName?: string
  subject?: string
  className?: string
  createdDate: Date
  dueDate: Date
  questionTypes: QuestionType[]
  instructions: string
  fileUrl?: string
  status: AssignmentStatus
  totalQuestions: number
  totalMarks: number
  generationStatus?: GenerationStatus
  questionPaper?: QuestionPaper
  generationError?: string
}

export interface StudentInfo {
  name: string
  rollNumber: string
  className: string
  date: Date
  duration: string
}

export interface FormData {
  title: string
  dueDate: Date | null
  questionTypes: QuestionType[]
  instructions: string
  file?: File
}

export interface CreateAssignmentPayload {
  title: string
  schoolName?: string
  subject?: string
  className?: string
  dueDate: string
  questionTypes: Array<{
    id?: string
    type: QuestionTypeEnum
    count: number
    marksPerQuestion: number
  }>
  instructions?: string
}
