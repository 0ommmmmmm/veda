'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Topbar } from './Topbar'
import {
  FileUploadBox,
  DueDateField,
  QuestionTypeRow,
  InstructionsTextarea,
  NavigationButtons,
} from './FormFields'
import { useAssignments } from '@/hooks/useAssignments'
import { toCreatePayload } from '@/lib/assignmentUtils'
import { QuestionType } from '@/lib/types'

export function CreateAssignmentForm() {
  const router = useRouter()
  const { createAssignment, error: storeError } = useAssignments()

  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    {
      id: uuidv4(),
      type: 'MCQ',
      count: 0,
      marksPerQuestion: 0,
    },
  ])
  const [instructions, setInstructions] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else if (dueDate <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future'
    }

    if (questionTypes.length === 0) {
      newErrors.questionTypes = 'Please add at least one question type'
    }

    const hasValidQuestions = questionTypes.some((qt) => qt.count > 0)
    if (!hasValidQuestions) {
      newErrors.questionTypes = 'At least one question type must have questions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      {
        id: uuidv4(),
        type: 'Short Answer',
        count: 0,
        marksPerQuestion: 0,
      },
    ])
  }

  const handleUpdateQuestionType = (
    id: string,
    updates: Partial<QuestionType>
  ) => {
    setQuestionTypes(
      questionTypes.map((qt) => (qt.id === id ? { ...qt, ...updates } : qt))
    )
  }

  const handleRemoveQuestionType = (id: string) => {
    if (questionTypes.length > 1) {
      setQuestionTypes(questionTypes.filter((qt) => qt.id !== id))
    }
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const assignment = await createAssignment(
        toCreatePayload({
          title: title.trim(),
          dueDate: dueDate!,
          questionTypes,
          instructions: instructions.trim() || undefined,
        })
      )

      if (assignment?.id) {
        router.push(`/assignment-output?id=${assignment.id}`)
      }
    } catch {
      // error shown via storeError
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Topbar title="Create Assignment" showBack={true} />
      <div className="pt-20 px-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8">
            {/* Title Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                Assignment Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mathematics Final Exam"
                className={`glass-input ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-2">{errors.title}</p>
              )}
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                Upload Question Paper (Optional)
              </label>
              <FileUploadBox onFileSelect={() => {}} />
            </div>

            {/* Due Date */}
            <div className="mb-8">
              <DueDateField
                value={dueDate}
                onChange={setDueDate}
                error={errors.dueDate}
              />
            </div>

            {/* Question Types Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Question Types
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure the types and distribution of questions
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                {questionTypes.map((qt) => (
                  <QuestionTypeRow
                    key={qt.id}
                    questionType={qt}
                    onUpdate={handleUpdateQuestionType}
                    onRemove={handleRemoveQuestionType}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={handleAddQuestionType}
                className="border-border text-foreground hover:bg-secondary gap-2 w-full mb-4"
              >
                <span>+</span>
                Add Question Type
              </Button>

              {errors.questionTypes && (
                <p className="text-xs text-red-500">{errors.questionTypes}</p>
              )}

              {/* Summary */}
              {questionTypes.length > 0 && (
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-foreground font-medium">Summary:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total Questions:{' '}
                    <span className="font-semibold">
                      {questionTypes.reduce((sum, qt) => sum + qt.count, 0)}
                    </span>{' '}
                    • Total Marks:{' '}
                    <span className="font-semibold">
                      {questionTypes.reduce(
                        (sum, qt) => sum + qt.count * qt.marksPerQuestion,
                        0
                      )}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <InstructionsTextarea
                value={instructions}
                onChange={setInstructions}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="border-t border-border pt-6">
              {storeError && (
                <p className="text-xs text-red-500 mb-4">{storeError}</p>
              )}
              <NavigationButtons
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
