import { z } from 'zod';

export const questionTypeEnum = z.enum([
  'MCQ',
  'Short Answer',
  'Essay',
  'Fill in the Blank',
  'Matching',
  'True/False',
]);

export const questionTypeSchema = z.object({
  id: z.string().optional(),
  type: questionTypeEnum,
  count: z.number().int().min(0, 'Question count must be 0 or more'),
  marksPerQuestion: z.number().int().min(0, 'Marks must be 0 or more'),
});

export const createAssignmentSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    schoolName: z.string().min(1).max(200).optional(),
    subject: z.string().min(1).max(200).optional(),
    className: z.string().min(1).max(100).optional(),
    dueDate: z.coerce.date().refine((date) => date > new Date(), {
      message: 'Due date must be in the future',
    }),
    questionTypes: z
      .array(questionTypeSchema)
      .min(1, 'Please add at least one question type'),
    instructions: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => data.questionTypes.some((qt) => qt.count > 0),
    { message: 'At least one question type must have questions', path: ['questionTypes'] }
  );

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
