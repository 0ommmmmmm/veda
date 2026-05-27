'use client'

import { Sidebar } from '@/components/vedaai/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Sidebar />
      <div className="lg:ml-80 flex flex-col min-h-screen">
        <main className="flex-1 pt-24 pb-32 lg:pb-10 overflow-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}
