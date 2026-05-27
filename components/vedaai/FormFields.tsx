'use client'

import { QuestionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, Calendar } from 'lucide-react'
import { useState } from 'react'

interface FilUploadBoxProps {
  onFileSelect: (file: File) => void
}

export function FileUploadBox({ onFileSelect }: FilUploadBoxProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
        isDragActive
          ? 'border-[#f05a3c] bg-[#fff7f4]'
          : 'border-[#d1d5db] hover:border-[#f05a3c] bg-[#f9fafb]'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl">📄</div>
        <div>
          <p className="text-sm font-medium text-[#111827]">
            Drag and drop your file here
          </p>
          <p className="text-xs text-[#6b7280]">or click to select</p>
        </div>
      </div>
    </div>
  )
}

interface DueDateFieldProps {
  value: Date | null
  onChange: (date: Date) => void
  error?: string
}

export function DueDateField({ value, onChange, error }: DueDateFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    onChange(date)
  }

  const dateValue = value ? value.toISOString().split('T')[0] : ''

  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-2">
        <Calendar className="w-4 h-4 inline mr-2" />
        Due Date
      </label>
      <input
        type="date"
        value={dateValue}
        onChange={handleChange}
        className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#f05a3c]"
      />
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}

interface QuestionTypeRowProps {
  questionType: QuestionType
  onUpdate: (id: string, updates: Partial<QuestionType>) => void
  onRemove: (id: string) => void
}

export function QuestionTypeRow({
  questionType,
  onUpdate,
  onRemove,
}: QuestionTypeRowProps) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Question Type
        </label>
        <select
          value={questionType.type}
          onChange={(e) =>
            onUpdate(questionType.id, { type: e.target.value as any })
          }
          className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none"
        >
          <option value="MCQ">Multiple Choice</option>
          <option value="Short Answer">Short Answer</option>
          <option value="Essay">Essay</option>
          <option value="Fill in the Blank">Fill in the Blank</option>
          <option value="Matching">Matching</option>
          <option value="True/False">True/False</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Number of Questions
        </label>
        <Input
          type="number"
          min="0"
          value={questionType.count}
          onChange={(e) =>
            onUpdate(questionType.id, { count: parseInt(e.target.value) || 0 })
          }
          className="rounded-xl border-[#d1d5db] bg-white"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Marks per Question
        </label>
        <Input
          type="number"
          min="0"
          value={questionType.marksPerQuestion}
          onChange={(e) =>
            onUpdate(questionType.id, {
              marksPerQuestion: parseInt(e.target.value) || 0,
            })
          }
          className="rounded-xl border-[#d1d5db] bg-white"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onRemove(questionType.id)}
        className="self-end border-[#e5e7eb] text-[#6b7280] hover:bg-red-50 hover:text-red-600 rounded-xl"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

interface InstructionsTextareaProps {
  value: string
  onChange: (value: string) => void
}

export function InstructionsTextarea({
  value,
  onChange,
}: InstructionsTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-2">
        Additional Instructions (Optional)
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add any special instructions for the assignment..."
        className="min-h-24 rounded-xl border border-[#d1d5db] bg-white"
      />
    </div>
  )
}

interface NavigationButtonsProps {
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  step?: number
  isSubmitting?: boolean
}

export function NavigationButtons({
  onPrevious,
  onNext,
  onSubmit,
  step = 1,
  isSubmitting = false,
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-3 justify-between sm:justify-end">
      {step > 1 && onPrevious && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="rounded-xl border-[#d1d5db]"
        >
          Previous
        </Button>
      )}
      {onNext ? (
        <Button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-[#111827] text-white hover:bg-[#1f2937]"
        >
          Next
        </Button>
      ) : onSubmit ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-[#111827] text-white hover:bg-[#1f2937] disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Assignment'}
        </Button>
      ) : null}
    </div>
  )
}
