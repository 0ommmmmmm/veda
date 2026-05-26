'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, RefreshCw } from 'lucide-react'
import { Topbar } from '@/components/vedaai/Topbar'
import { QuestionPaper } from '@/components/vedaai/QuestionPaper'
import { GenerationStatusPanel } from '@/components/vedaai/GenerationStatusPanel'
import { useAssignmentStore } from '@/store/assignments'
import { mockStudentInfo } from '@/lib/mock-data'
import { isGenerationInProgress } from '@/lib/paperDisplay'
import {
  connectSocket,
  joinAssignment,
  leaveAssignment,
  onGenerationCompleted,
  onGenerationFailed,
} from '@/lib/socket'

function AssignmentOutputContent() {
  const searchParams = useSearchParams()
  const assignmentId = searchParams.get('id')

  const assignment = useAssignmentStore((s) => {
    if (!assignmentId) return null
    if (s.currentAssignment?.id === assignmentId) return s.currentAssignment
    return s.assignments.find((a) => a.id === assignmentId) ?? null
  })

  const loading = useAssignmentStore((s) => s.loading)
  const error = useAssignmentStore((s) => s.error)
  const fetchAssignmentById = useAssignmentStore((s) => s.fetchAssignmentById)

  const generationStatus = useAssignmentStore((s) => {
    if (!assignmentId) return undefined
    if (s.currentAssignment?.id === assignmentId) {
      return s.currentAssignment.generationStatus
    }
    return s.assignments.find((a) => a.id === assignmentId)?.generationStatus
  })

  const [regenerating, setRegenerating] = useState(false)
  const regenerateInFlightRef = useRef(false)

  const fetchAssignmentByIdRef = useRef(fetchAssignmentById)
  fetchAssignmentByIdRef.current = fetchAssignmentById

  const inProgress = isGenerationInProgress(generationStatus)
  const isFailed = generationStatus === 'failed'
  const showStatusPanel =
    generationStatus === 'queued' ||
    generationStatus === 'processing' ||
    generationStatus === 'failed'

  useEffect(() => {
    if (!assignmentId) return
    void fetchAssignmentByIdRef.current(assignmentId)
  }, [assignmentId])

  useEffect(() => {
    if (!assignmentId) return

    const shouldPoll =
      generationStatus === 'queued' || generationStatus === 'processing'

    if (!shouldPoll) return

    const interval = setInterval(() => {
      console.log('[output] polling fetch only')
      void fetchAssignmentById(assignmentId, { silent: true })
    }, 1500)

    return () => clearInterval(interval)
  }, [assignmentId, generationStatus, fetchAssignmentById])

  useEffect(() => {
    if (!assignmentId) return

    connectSocket()
    joinAssignment(assignmentId)

    const unsubCompleted = onGenerationCompleted((data) => {
      if (data.assignmentId !== assignmentId) return
      void fetchAssignmentByIdRef.current(assignmentId, { silent: true })
    })

    const unsubFailed = onGenerationFailed((data) => {
      if (data.assignmentId !== assignmentId) return
      void fetchAssignmentByIdRef.current(assignmentId, { silent: true })
    })

    return () => {
      unsubCompleted()
      unsubFailed()
      leaveAssignment(assignmentId)
    }
  }, [assignmentId])

  if (!assignmentId) {
    return (
      <>
        <Topbar title="Question Paper" showBack={true} />
        <div className="pt-20 px-8 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-foreground text-lg">No assignment selected</p>
          </div>
        </div>
      </>
    )
  }

  if (loading && !assignment) {
    return (
      <>
        <Topbar title="Question Paper" showBack={true} />
        <div className="pt-28 px-8 pb-12 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  if (!assignment) {
    return (
      <>
        <Topbar title="Question Paper" showBack={true} />
        <div className="pt-20 px-8 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-foreground text-lg">Assignment not found</p>
            {error && (
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            )}
          </div>
        </div>
      </>
    )
  }

  console.log(
    '[output] render',
    assignment.id,
    assignment.generationStatus,
    assignment.questionPaper?.sections?.length
  )

  return (
    <>
      <Topbar title={assignment.title} showBack={true} />
      <div className="relative z-10 pt-28 px-8 pb-12 print:pt-4 print:px-4">
        <div className="max-w-4xl mx-auto">
          {showStatusPanel && (
            <GenerationStatusPanel
              status={generationStatus}
              errorMessage={assignment.generationError}
            />
          )}

          {inProgress && (
            <div className="glass-card p-8 mb-6 flex flex-col items-center justify-center text-center print:hidden">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
              <p className="text-sm text-muted-foreground">
                Generating question paper… This usually takes a few seconds.
              </p>
            </div>
          )}

          <div className="mb-4 rounded-xl border border-green-500 bg-green-50 p-4 text-green-800 dark:bg-green-950 dark:text-green-100">
            Paper loaded: {assignment.id} | Status: {assignment.generationStatus}{' '}
            | Sections: {assignment.questionPaper?.sections?.length ?? 0}
          </div>

          <QuestionPaper
            assignment={assignment}
            studentInfo={mockStudentInfo}
            questionPaper={assignment.questionPaper}
          />

          <div className="bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6 mt-6 print:hidden">
            <p className="text-white text-sm leading-relaxed">
              Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
            </p>
          </div>

          <div className="mb-6 flex gap-3 flex-wrap print:hidden">
            <button
              onClick={() => {
                const btn = document.getElementById(
                  'pdf-download-btn'
                ) as HTMLButtonElement | null
                btn?.click()
              }}
              className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-xl font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Download as PDF
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('[output] regenerate clicked')
                if (
                  !assignmentId ||
                  regenerateInFlightRef.current ||
                  generationStatus === 'queued' ||
                  generationStatus === 'processing'
                ) {
                  return
                }
                regenerateInFlightRef.current = true
                setRegenerating(true)
                void useAssignmentStore
                  .getState()
                  .regenerateAssignment(assignmentId)
                  .catch(() => {
                    // error in store
                  })
                  .finally(() => {
                    regenerateInFlightRef.current = false
                    setRegenerating(false)
                  })
              }}
              disabled={
                regenerating ||
                generationStatus === 'queued' ||
                generationStatus === 'processing'
              }
              className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-orange-500 rounded-xl font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${regenerating || generationStatus === 'queued' || generationStatus === 'processing' ? 'animate-spin' : ''}`}
              />
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>

          {isFailed && (
            <p className="text-sm text-muted-foreground text-center mb-6 print:hidden">
              Generation failed. Use Regenerate above to try again.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default function AssignmentOutputPage() {
  return (
    <Suspense fallback={<div className="pt-20 px-8">Loading...</div>}>
      <AssignmentOutputContent />
    </Suspense>
  )
}
