'use client'

import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react'
import type { GenerationStatus } from '@/lib/types'

interface GenerationStatusPanelProps {
  status: GenerationStatus | undefined
  errorMessage?: string
}

const STEPS: { key: GenerationStatus; label: string }[] = [
  { key: 'queued', label: 'Queued' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
]

function stepIndex(status: GenerationStatus | undefined): number {
  if (status === 'queued') return 0
  if (status === 'processing') return 1
  if (status === 'completed') return 2
  if (status === 'failed') return 1
  return -1
}

export function GenerationStatusPanel({
  status,
  errorMessage,
}: GenerationStatusPanelProps) {
  const activeIndex = stepIndex(status)
  const isFailed = status === 'failed'
  const isQueued = status === 'queued'
  const isProcessing = status === 'processing'

  return (
    <div className="glass-card p-8 mb-6">
      <div className="flex items-center justify-between mb-6 max-w-lg mx-auto">
        {STEPS.map((step, index) => {
          const isActive = !isFailed && activeIndex === index
          const isDone = !isFailed && activeIndex > index
          const isFailedStep = isFailed && index === 1

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {index < STEPS.length - 1 && (
                <div
                  className={`absolute top-4 left-[50%] w-full h-0.5 ${
                    isDone ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  isFailedStep
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : isDone
                      ? 'bg-orange-500 text-white'
                      : isActive
                        ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500'
                        : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {isFailedStep ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive || isDone
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="text-center">
        {isFailed && (
          <>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Generation failed
            </p>
            <p className="text-sm text-muted-foreground">
              {errorMessage ??
                'Something went wrong while generating the question paper.'}
            </p>
          </>
        )}
        {isQueued && (
          <>
            <p className="text-lg font-semibold text-foreground mb-2">
              Queued for generation
            </p>
            <p className="text-sm text-muted-foreground">
              Your assignment is in the queue. Generation will start shortly.
            </p>
          </>
        )}
        {isProcessing && (
          <>
            <p className="text-lg font-semibold text-foreground mb-2">
              Generating question paper
            </p>
            <p className="text-sm text-muted-foreground">
              AI is creating questions based on your assignment. This may take a
              moment.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
