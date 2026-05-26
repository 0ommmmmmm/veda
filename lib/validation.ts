import { z } from 'zod'

export const questionTypeSchema = z.object({
  id: z.string(),
  type: z.enum(['MCQ', 'Short Answer', 'Essay', 'Fill in the Blank', 'Matching', 'True/False']),
  count: z.number().int().min(0, 'Question count must be 0 or more'),
  marksPerQuestion: z.number().int().min(0, 'Marks must be 0 or more'),
})

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  dueDate: z.date().refine((date) => date > new Date(), 'Due date must be in the future'),
  questionTypes: z
    .array(questionTypeSchema)
    .min(1, 'Please add at least one question type'),
  instructions: z.string().optional(),
})

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>
export type QuestionTypeInput = z.infer<typeof questionTypeSchema>
