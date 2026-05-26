'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  title?: string
  showBack?: boolean
}

export function Topbar({ title, showBack = false }: TopbarProps) {
  const router = useRouter()

  const topbarVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={topbarVariants}
      className="fixed top-4 left-80 right-4 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-between px-8 z-40"
    >
      <div className="flex items-center gap-4">
        {showBack && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
        {title && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-lg font-semibold text-black dark:text-white"
          >
            {title}
          </motion.h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          </Button>
        </motion.div>
        <Link href="/profile">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="w-8 h-8 bg-[#f05a3c] rounded-lg flex items-center justify-center text-white text-xs font-semibold">
              JD
            </div>
            <span className="text-sm font-medium text-black dark:text-white">John Doe</span>
          </motion.button>
        </Link>
      </div>
    </motion.header>
  )
}
