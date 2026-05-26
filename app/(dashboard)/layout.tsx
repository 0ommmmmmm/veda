'use client'

import { motion } from 'framer-motion'
import { Sidebar } from '@/components/vedaai/Sidebar'
import { Topbar } from '@/components/vedaai/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
  }

  return (
    <div className="flex h-screen bg-[#e9e9e7] dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-80 flex flex-col">
        <Topbar />
        <motion.main
          initial="hidden"
          animate="visible"
          variants={pageVariants}
          className="flex-1 pt-20 overflow-auto pb-8 bg-[#e9e9e7] dark:bg-gray-900"
        >
          <div className="h-full">{children}</div>
        </motion.main>
      </div>
    </div>
  )
}
