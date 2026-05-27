import mongoose, { Document, Schema } from 'mongoose';
import type {
  AssignmentStatus,
  GenerationStatus,
  QuestionPaper,
  QuestionType,
} from '../types/assignment.types';

export interface IAssignment extends Document {
  title: string;
  createdDate: Date;
  dueDate: Date;
  questionTypes: QuestionType[];
  instructions: string;
  fileUrl?: string;
  status: AssignmentStatus;
  totalQuestions: number;
  totalMarks: number;
  generationStatus: GenerationStatus;
  questionPaper?: QuestionPaper;
  generationError?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const questionTypeSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['MCQ', 'Short Answer', 'Essay', 'Fill in the Blank', 'Matching', 'True/False'],
      required: true,
    },
    count: { type: Number, required: true, min: 0 },
    marksPerQuestion: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    createdDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [questionTypeSchema], required: true },
    instructions: { type: String, default: '' },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed'],
      default: 'draft',
    },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    generationStatus: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    questionPaper: { type: Schema.Types.Mixed },
    generationError: { type: String },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
