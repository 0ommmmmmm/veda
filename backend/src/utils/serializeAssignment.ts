import type { IAssignment } from '../models/Assignment';
import type { SerializedAssignment } from '../types/assignment.types';

export function serializeAssignment(
  doc: IAssignment,
  options?: { includeQuestionPaper?: boolean }
): SerializedAssignment {
  const includeQuestionPaper = options?.includeQuestionPaper ?? true;

  const serialized: SerializedAssignment = {
    id: doc._id.toString(),
    title: doc.title,
    schoolName: doc.schoolName,
    subject: doc.subject,
    className: doc.className,
    createdDate: doc.createdDate.toISOString(),
    dueDate: doc.dueDate.toISOString(),
    questionTypes: doc.questionTypes,
    instructions: doc.instructions,
    status: doc.status,
    totalQuestions: doc.totalQuestions,
    totalMarks: doc.totalMarks,
    generationStatus: doc.generationStatus,
  };

  if (doc.fileUrl) {
    serialized.fileUrl = doc.fileUrl;
  }

  if (doc.generationError) {
    serialized.generationError = doc.generationError;
  }

  if (includeQuestionPaper && doc.questionPaper) {
    serialized.questionPaper = doc.questionPaper;
  }

  return serialized;
}
