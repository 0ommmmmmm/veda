'use client'

import { Topbar } from '@/components/vedaai/Topbar'
import { Users } from 'lucide-react'

export default function GroupsPage() {
  return (
    <>
      <Topbar title="My Groups" />
      <div className="pt-28 px-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">Groups coming soon</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This section is part of the broader VedaAI workspace.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Create groups to collaborate with colleagues and manage assignments together.</p>
          </div>
        </div>
      </div>
    </>
  )
}
