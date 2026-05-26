export type QuestionTypeEnum =
  | 'MCQ'
  | 'Short Answer'
  | 'Essay'
  | 'Fill in the Blank'
  | 'Matching'
  | 'True/False';

export type AssignmentStatus = 'draft' | 'published' | 'completed';

export type GenerationStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface QuestionType {
  id: string;
  type: QuestionTypeEnum;
  count: number;
  marksPerQuestion: number;
}

export interface GeneratedQuestion {
  id: string;
  number: number;
  text: string;
  marks: number;
  difficulty: Difficulty;
  options?: string[];
}

export interface GeneratedSection {
  sectionLabel: string;
  questionType: QuestionType;
  questions: GeneratedQuestion[];
}

export interface QuestionPaper {
  assignmentId: string;
  title: string;
  instructions: string;
  totalQuestions: number;
  totalMarks: number;
  generatedAt: string;
  sections: GeneratedSection[];
}

export interface SerializedAssignment {
  id: string;
  title: string;
  createdDate: string;
  dueDate: string;
  questionTypes: QuestionType[];
  instructions: string;
  fileUrl?: string;
  status: AssignmentStatus;
  totalQuestions: number;
  totalMarks: number;
  generationStatus: GenerationStatus;
  questionPaper?: QuestionPaper;
  generationError?: string;
}
