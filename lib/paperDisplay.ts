import type { Assignment, GenerationStatus } from './types'

export function hasQuestionPaper(assignment: Assignment): boolean {
  return (assignment.questionPaper?.sections?.length ?? 0) > 0
}

export function canRenderQuestionPaper(assignment: Assignment): boolean {
  if (hasQuestionPaper(assignment)) return true
  return assignment.questionTypes.some((qt) => qt.count > 0)
}

export function isGenerationInProgress(
  status?: GenerationStatus
): boolean {
  return status === 'queued' || status === 'processing'
}
