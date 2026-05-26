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
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md'
          : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 bg-gray-50 dark:bg-gray-900/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="text-5xl">📄</div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Drag and drop your file here
          </p>
          <p className="text-xs text-muted-foreground">or click to select</p>
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
      <label className="block text-sm font-medium text-foreground mb-3">
        <Calendar className="w-4 h-4 inline mr-2" />
        Due Date
      </label>
      <input
        type="date"
        value={dateValue}
        onChange={handleChange}
        className="glass-input"
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
    <div className="glass-card flex items-end gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-foreground mb-2">
          Question Type
        </label>
        <select
          value={questionType.type}
          onChange={(e) =>
            onUpdate(questionType.id, { type: e.target.value as any })
          }
          className="glass-input"
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
        <label className="block text-sm font-medium text-foreground mb-2">
          Number of Questions
        </label>
        <Input
          type="number"
          min="0"
          value={questionType.count}
          onChange={(e) =>
            onUpdate(questionType.id, { count: parseInt(e.target.value) || 0 })
          }
          className="glass-input"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-foreground mb-2">
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
          className="glass-input"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onRemove(questionType.id)}
        className="border-black/5 dark:border-white/10 text-foreground hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all"
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
      <label className="block text-sm font-medium text-foreground mb-3">
        Additional Instructions (Optional)
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add any special instructions for the assignment..."
        className="glass-input min-h-24"
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
    <div className="flex gap-3 justify-end">
      {step > 1 && onPrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="gradient-btn gradient-btn-secondary"
        >
          Previous
        </Button>
      )}
      {onNext ? (
        <Button
          onClick={onNext}
          className="gradient-btn gradient-btn-primary"
        >
          Next
        </Button>
      ) : onSubmit ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="gradient-btn gradient-btn-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Assignment'}
        </Button>
      ) : null}
    </div>
  )
}
