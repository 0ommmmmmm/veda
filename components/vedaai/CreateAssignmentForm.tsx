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
import { useSettingsStore } from '@/store/settings'

export function CreateAssignmentForm() {
  const router = useRouter()
  const { createAssignment, error: storeError } = useAssignments()
  const settings = useSettingsStore((s) => s.settings)

  const [title, setTitle] = useState('')
  const [schoolName, setSchoolName] = useState(settings.schoolName || '')
  const [subject, setSubject] = useState(settings.subject || '')
  const [className, setClassName] = useState(settings.className || '')
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
          schoolName: schoolName.trim() || undefined,
          subject: subject.trim() || undefined,
          className: className.trim() || undefined,
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-[#e5e7eb] bg-white shadow-sm p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-[#111827] mb-6">
              Create Assignment
            </h1>
            {/* Title Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Assignment Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mathematics Final Exam"
                className={`rounded-xl border-[#d1d5db] bg-white ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-2">{errors.title}</p>
              )}
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  School Name
                </label>
                <Input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g., Delhi Public School"
                  className="rounded-xl border-[#d1d5db] bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., English"
                  className="rounded-xl border-[#d1d5db] bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Class
                </label>
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g., 5th"
                  className="rounded-xl border-[#d1d5db] bg-white"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#111827] mb-2">
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
                  <h3 className="text-lg font-semibold text-[#111827]">
                    Question Types
                  </h3>
                  <p className="text-sm text-[#6b7280]">
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
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddQuestionType()
                }}
                className="border-[#d1d5db] text-[#111827] hover:bg-[#f9fafb] gap-2 w-full mb-4 rounded-xl"
              >
                <span>+</span>
                Add Question Type
              </Button>

              {errors.questionTypes && (
                <p className="text-xs text-red-500">{errors.questionTypes}</p>
              )}

              {/* Summary */}
              {questionTypes.length > 0 && (
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e5e7eb]">
                  <p className="text-sm text-[#111827] font-medium">Summary:</p>
                  <p className="text-sm text-[#6b7280] mt-1">
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
            <div className="border-t border-[#e5e7eb] pt-6">
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
