'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.05, duration: 0.3, ease: 'easeOut' as const },
    },
  }

  return (
    <div className="relative">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex items-center justify-between"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
            {assignment.title}
          </h3>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Assigned on:</p>
              <p className="font-medium text-black dark:text-white">{assignedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Due:</p>
              <p className="font-medium text-black dark:text-white">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Three-dot menu */}
        <div className="relative ml-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>
          </motion.div>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15, ease: 'easeOut' as const }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              >
                <Link href={`/assignment-output?id=${assignment.id}`}>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgb(243, 244, 246)' }}
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 first:rounded-t-xl transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Assignment
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  onClick={() => void handleDelete()}
                  disabled={deleting || loading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 dark:hover:bg-red-900/30 last:rounded-b-xl border-t border-gray-200 dark:border-gray-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
