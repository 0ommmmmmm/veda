'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Topbar } from '@/components/vedaai/Topbar'
import { AssignmentCard } from '@/components/vedaai/AssignmentCard'
import { EmptyState } from '@/components/vedaai/EmptyState'
import { useAssignments } from '@/hooks/useAssignments'

export default function AssignmentsPage() {
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
        <div className="pt-28 px-8 pb-24 flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      </>
    )
  }

  if (assignments.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <Topbar title="Assignments" />
      <div className="pt-28 px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          {isUsingMockFallback && error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
              {error}
            </div>
          )}

          <div className="flex gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' as const }}
              className="w-56 flex-shrink-0"
            >
              <h3 className="text-sm font-semibold text-black dark:text-white mb-4">Filters</h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3, ease: 'easeOut' as const }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
              >
                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">All Assignments</span>
                </label>
                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Published</span>
                </label>
                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Draft</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                </label>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' as const }}
              className="flex-1"
            >
              <div className="mb-6">
                <motion.input
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  type="text"
                  placeholder="Search assignments..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} index={index} />
                ))}
              </div>
            </motion.div>
          </div>

          <Link href="/create">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' as const }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.button
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                className="gradient-btn gradient-btn-primary gap-2 rounded-full h-14 px-8 shadow-xl flex items-center"
              >
                <Plus className="w-5 h-5" />
                <span>Create Assignment</span>
              </motion.button>
            </motion.div>
          </Link>
        </div>
      </div>
    </>
  )
}
