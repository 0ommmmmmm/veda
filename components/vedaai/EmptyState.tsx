'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Plus } from 'lucide-react'

export function EmptyState() {
  const router = useRouter()

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#e5e7eb] bg-white p-8 sm:p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-2xl bg-[#fff7f4] border border-[#fde4dc] flex items-center justify-center">
            <BookOpen className="w-9 h-9 text-[#f05a3c]" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#111827] mb-2">
          No assignments yet
        </h2>
        <p className="text-[#6b7280] mb-8 text-sm sm:text-base">
          Create your first assignment to get started.
        </p>
        <button
          type="button"
          onClick={() => {
            router.push('/create')
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-medium text-white hover:bg-[#1f2937]"
        >
          <Plus className="w-4 h-4" />
          Create Your First Assignment
        </button>
      </div>
    </div>
  )
}
