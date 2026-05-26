'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Home, Users, Lightbulb, Library, Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/assignments', icon: Home },
    { label: 'My Groups', href: '/groups', icon: Users },
    { label: 'Assignments', href: '/assignments', icon: BookOpen },
    { label: "AI Teacher's Toolkit", href: '#', icon: Lightbulb },
    { label: 'My Library', href: '#', icon: Library },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href)

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const },
    }),
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="fixed left-4 top-4 bottom-4 w-64 flex flex-col z-50 bg-white rounded-3xl shadow-lg p-6 dark:bg-gray-800"
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {/* Orange-red gradient square icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#f05a3c] to-[#d64828] rounded-lg flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            VedaAI
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <motion.div key={item.label} custom={i} variants={itemVariants} initial="hidden" animate="visible">
              <Link href={item.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    active
                      ? 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* School Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3, ease: 'easeOut' as const }}
        className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl"
      >
        <p className="text-sm font-semibold text-black dark:text-white">Delhi Public School</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Bokaro Steel City</p>
      </motion.div>
    </motion.aside>
  )
}
