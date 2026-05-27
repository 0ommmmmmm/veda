'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen,
  Home,
  Users,
  Lightbulb,
  Library,
  Settings,
  Plus,
} from 'lucide-react'
import { useSettingsStore } from '@/store/settings'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const settings = useSettingsStore((s) => s.settings)

  const navItems = [
    { label: 'Home', href: '/assignments', icon: Home },
    { label: 'My Groups', href: '/groups', icon: Users },
    { label: 'Assignments', href: '/assignments', icon: BookOpen },
    { label: "AI Teacher's Toolkit", href: '#', icon: Lightbulb },
    { label: 'My Library', href: '#', icon: Library },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href: string) =>
    href !== '#' && (pathname === href || pathname.startsWith(href))

  return (
    <>
      <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 w-72 flex-col z-40 rounded-3xl bg-white shadow-sm border border-[#eef0f3] p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#eef0f3] flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Company logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-semibold text-[#111827]">VedaAI</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log('[desktop] create assignment clicked')
            router.push('/create')
          }}
          className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1f2937] w-full"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? 'bg-[#f3f4f6] text-[#111827] font-medium'
                      : 'text-[#4b5563] hover:bg-[#f9fafb]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="rounded-2xl bg-[#f8fafc] border border-[#e5e7eb] p-4">
          <p className="text-sm font-semibold text-[#111827]">{settings.schoolName}</p>
          <p className="text-xs text-[#6b7280]">{settings.location}</p>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-[#e5e7eb] bg-white/95 backdrop-blur p-2 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: 'Home', href: '/assignments', icon: Home },
            { label: 'Groups', href: '/groups', icon: Users },
            { label: 'Assign', href: '/assignments', icon: BookOpen },
            { label: 'Toolkit', href: '#', icon: Lightbulb },
            { label: 'Settings', href: '/settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] ${
                    active ? 'text-[#f05a3c] bg-[#fff7f4]' : 'text-[#6b7280]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}