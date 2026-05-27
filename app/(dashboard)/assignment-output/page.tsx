'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, RefreshCw } from 'lucide-react'
import { Topbar } from '@/components/vedaai/Topbar'
import { QuestionPaper } from '@/components/vedaai/QuestionPaper'
import { GenerationStatusPanel } from '@/components/vedaai/GenerationStatusPanel'
import { useAssignmentStore } from '@/store/assignments'
import { useToast } from '@/hooks/use-toast'
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
  const currentAssignment = useAssignmentStore((s) => s.currentAssignment)
  const regenerateAssignment = useAssignmentStore((s) => s.regenerateAssignment)
  const { toast } = useToast()

  const assignment =
    currentAssignment?.id === assignmentId ? currentAssignment : null

  const loading = useAssignmentStore((s) => s.loading)
  const fetchAssignmentById = useAssignmentStore((s) => s.fetchAssignmentById)

  const generationStatus = useAssignmentStore((s) => {
    if (!assignmentId) return undefined
    if (s.currentAssignment?.id === assignmentId) {
      return s.currentAssignment.generationStatus
    }
    return s.assignments.find((a) => a.id === assignmentId)?.generationStatus
  })
  const fetchAssignmentByIdRef = useRef(fetchAssignmentById)
  fetchAssignmentByIdRef.current = fetchAssignmentById
  const regenerateInFlightRef = useRef(false)

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

  if (loading && !assignment) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center text-[#6b7280]">
          Loading assignment...
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center text-[#6b7280]">
          Assignment not found
        </div>
      </div>
    )
  }

  const defaultStudentInfo = {
    name: '________________',
    rollNumber: '____________',
    className: '____________',
    date: new Date(),
    duration: '2 Hours',
  }

  const isInProgress =
    generationStatus === 'queued' || generationStatus === 'processing'
  const showStatus =
    generationStatus === 'queued' ||
    generationStatus === 'processing' ||
    generationStatus === 'failed'

  const canRegenerate =
    !!assignmentId &&
    assignmentId !== '1' &&
    generationStatus !== 'queued' &&
    generationStatus !== 'processing'

  const handleRegenerate = async () => {
    // Hard guards (requested)
    if (!assignmentId || assignmentId === '1') return
    if (generationStatus === 'queued' || generationStatus === 'processing') return
    if (regenerateInFlightRef.current) return

    regenerateInFlightRef.current = true
    try {
      await regenerateAssignment(assignmentId)
    } catch {
      // Prevent unhandled rejection + show user-friendly message
      toast({
        title: 'Backend unavailable',
        description: 'Please start backend server.',
        variant: 'destructive',
      })
    } finally {
      setTimeout(() => {
        regenerateInFlightRef.current = false
      }, 3000)
    }
  }

  return (
    <>
      <Topbar title={assignment.title} showBack={true} />
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const btn = document.getElementById(
                  'pdf-download-btn'
                ) as HTMLButtonElement | null
                btn?.click()
              }}
              className="rounded-xl border border-[#111827] px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void handleRegenerate()
              }}
              disabled={!canRegenerate || regenerateInFlightRef.current || isInProgress}
              className="rounded-xl bg-[#111827] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f2937] disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isInProgress ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>

          {showStatus && (
            <GenerationStatusPanel
              status={generationStatus}
              errorMessage={assignment.generationError}
            />
          )}

          {isInProgress && (
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 flex items-center justify-center gap-2 text-[#6b7280]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating question paper...
            </div>
          )}

          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-3 sm:p-5">
            <QuestionPaper
              assignment={assignment}
              studentInfo={defaultStudentInfo}
              questionPaper={assignment.questionPaper}
            />
          </div>
        </div>
      </main>
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
