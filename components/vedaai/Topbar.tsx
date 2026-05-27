'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/store/settings'

interface TopbarProps {
  title?: string
  showBack?: boolean
}

export function Topbar({ title, showBack = false }: TopbarProps) {
  const router = useRouter()
  const settings = useSettingsStore((s) => s.settings)

  const initials = settings.teacherName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')

  return (
    <header className="fixed top-4 left-4 right-4 lg:left-[20rem] z-30 lg:z-40">
      <div className="h-16 rounded-2xl border border-[#e5e7eb] bg-white shadow-sm px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl text-[#4b5563] hover:bg-[#f3f4f6]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {title && <h2 className="text-base lg:text-lg font-semibold text-[#111827]">{title}</h2>}
      </div>

      <div className="hidden md:flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 min-w-[240px]">
        <Search className="w-4 h-4 text-[#9ca3af]" />
        <input
          placeholder="Search"
          className="bg-transparent text-sm outline-none text-[#374151] placeholder:text-[#9ca3af] w-full"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-[#4b5563] hover:bg-[#f3f4f6] relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-[#f05a3c] rounded-full" />
        </Button>
        <Link href="/profile">
          <button className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] px-2.5 py-1.5 hover:bg-[#f9fafb] transition-colors">
            <div className="w-8 h-8 bg-[#f05a3c] rounded-lg flex items-center justify-center text-white text-xs font-semibold">
              {initials || 'JD'}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-[#111827]">
              {settings.teacherName}
            </span>
          </button>
        </Link>
      </div>
      </div>
    </header>
  )
}
