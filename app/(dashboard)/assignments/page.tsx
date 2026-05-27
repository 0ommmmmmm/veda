'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Topbar } from '@/components/vedaai/Topbar'
import { AssignmentCard } from '@/components/vedaai/AssignmentCard'
import { EmptyState } from '@/components/vedaai/EmptyState'
import { useAssignments } from '@/hooks/useAssignments'

export default function AssignmentsPage() {
  const router = useRouter()
  const {
    assignments,
    loading,
    error,
    isUsingMockFallback,
    fetchAssignments,
  } = useAssignments()

  useEffect(() => {
    void fetchAssignments()
  }, [fetchAssignments])

  if (loading && assignments.length === 0) {
    return (
      <>
        <Topbar title="Assignments" />
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center text-[#6b7280]">
            Loading assignments...
          </div>
        </div>
      </>
    )
  }

  if (assignments.length === 0) {
    return (
      <>
        <Topbar title="Assignments" />
        <EmptyState />
      </>
    )
  }

  return (
    <>
      <Topbar title="Assignments" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {isUsingMockFallback && error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
              {error}
            </div>
          )}

          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-[#6b7280]">
              {assignments.length} assignment{assignments.length > 1 ? 's' : ''}
            </p>
            <button
              type="button"
              onClick={() => {
                console.log('[mobile] create assignment clicked')
                router.push('/create')
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2937]"
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assignment, index) => (
              <AssignmentCard key={assignment.id} assignment={assignment} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
