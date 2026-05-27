'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import { MoreVertical, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Assignment } from '@/lib/types'
import { useAssignments } from '@/hooks/useAssignments'

interface AssignmentCardProps {
  assignment: Assignment
  index?: number
}

export function AssignmentCard({ assignment, index = 0 }: AssignmentCardProps) {
  const { deleteAssignment, loading } = useAssignments()
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return
    }
    setDeleting(true)
    try {
      await deleteAssignment(assignment.id)
      setShowMenu(false)
    } catch {
      // error surfaced via store
    } finally {
      setDeleting(false)
    }
  }

  const dueDate = new Date(assignment.dueDate)
  const formattedDate = dueDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const assignedDate = new Date(assignment.createdDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#111827] mb-3 line-clamp-2">
            {assignment.title}
          </h3>
          <div className="flex flex-wrap gap-6 text-sm text-[#6b7280]">
            <div>
              <p className="text-xs">Assigned on:</p>
              <p className="font-medium text-[#111827]">{assignedDate}</p>
            </div>
            <div>
              <p className="text-xs">Due:</p>
              <p className="font-medium text-[#111827]">{formattedDate}</p>
            </div>
          </div>
        </div>

        <div className="relative ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg hover:bg-[#f3f4f6]"
          >
            <MoreVertical className="w-5 h-5 text-[#6b7280]" />
          </Button>

          <AnimatePresence>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e5e7eb] z-50 overflow-hidden">
                <Link href={`/assignment-output?id=${assignment.id}`}>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#374151] hover:bg-[#f9fafb] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Assignment
                  </button>
                </Link>
                <button
                  onClick={() => void handleDelete()}
                  disabled={deleting || loading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-[#e5e7eb] transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
