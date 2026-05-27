'use client'

import { Topbar } from '@/components/vedaai/Topbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSettingsStore } from '@/store/settings'

export default function ProfilePage() {
  const settings = useSettingsStore((s) => s.settings)
  const initials = settings.teacherName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')

  return (
    <>
      <Topbar title="Profile" showBack={true} />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl border border-[#e5e7eb] shadow-sm p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-[#f05a3c] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {initials || 'JD'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">
                  {settings.teacherName}
                </h2>
                <p className="text-[#6b7280]">Teacher</p>
                <p className="text-sm text-[#6b7280]">{settings.email}</p>
              </div>
            </div>
            <Link href="/settings">
              <Button className="w-full rounded-2xl bg-[#111827] text-white hover:bg-[#1f2937]">
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* School Details */}
          <div className="bg-white rounded-3xl border border-[#e5e7eb] shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">School Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">School Name</span>
                <span className="text-[#111827] font-medium">{settings.schoolName}</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e7eb] pt-4">
                <span className="text-[#6b7280]">Location</span>
                <span className="text-[#111827] font-medium">{settings.location}</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e7eb] pt-4">
                <span className="text-[#6b7280]">Role</span>
                <span className="text-[#111827] font-medium">Teacher</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-3xl border border-[#e5e7eb] shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Email</span>
                <span className="text-[#111827] font-medium">{settings.email}</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e7eb] pt-4">
                <span className="text-[#6b7280]">Member Since</span>
                <span className="text-[#111827] font-medium">May 26, 2024</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e7eb] pt-4">
                <span className="text-[#6b7280]">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
