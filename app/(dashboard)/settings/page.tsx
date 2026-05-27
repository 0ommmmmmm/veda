'use client'

import { useMemo, useState } from 'react'
import { Topbar } from '@/components/vedaai/Topbar'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/store/settings'
import { toast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const saved = useSettingsStore((s) => s.settings)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  const [teacherName, setTeacherName] = useState(saved.teacherName)
  const [email, setEmail] = useState(saved.email)
  const [schoolName, setSchoolName] = useState(saved.schoolName)
  const [location, setLocation] = useState(saved.location)
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    saved.notificationsEnabled
  )
  const [defaultDifficulty, setDefaultDifficulty] = useState(
    saved.defaultDifficulty
  )
  const [defaultMarksPerQuestion, setDefaultMarksPerQuestion] = useState(
    saved.defaultMarksPerQuestion
  )

  const canSave = useMemo(() => {
    if (!teacherName.trim()) return false
    if (!email.trim()) return false
    if (!schoolName.trim()) return false
    if (!location.trim()) return false
    if (!Number.isFinite(defaultMarksPerQuestion) || defaultMarksPerQuestion <= 0)
      return false
    return true
  }, [teacherName, email, schoolName, location, defaultMarksPerQuestion])

  return (
    <>
      <Topbar title="Settings" showBack={true} />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">
              Profile settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Teacher name
                </label>
                <input
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#f05a3c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#f05a3c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  School name
                </label>
                <input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#f05a3c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#f05a3c]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">
              App preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Notifications</p>
                  <p className="text-xs text-[#6b7280]">Enable reminders and updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Default difficulty
                </label>
                <select
                  value={defaultDifficulty}
                  onChange={(e) => setDefaultDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Default marks per question
                </label>
                <input
                  type="number"
                  min={1}
                  value={defaultMarksPerQuestion}
                  onChange={(e) =>
                    setDefaultMarksPerQuestion(Number(e.target.value || 0))
                  }
                  className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#f05a3c]"
                />
              </div>

              <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3">
                <p className="text-sm font-medium text-[#111827]">Theme</p>
                <p className="text-xs text-[#6b7280]">Light theme (recommended)</p>
                <div className="mt-2 inline-flex rounded-xl border border-[#e5e7eb] bg-white p-1">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium bg-[#111827] text-white"
                    disabled
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#6b7280]"
                    disabled
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            disabled={!canSave}
            onClick={() => {
              updateSettings({
                teacherName: teacherName.trim(),
                email: email.trim(),
                schoolName: schoolName.trim(),
                location: location.trim(),
                notificationsEnabled,
                defaultDifficulty,
                defaultMarksPerQuestion,
                theme: 'light',
              })
              toast({
                title: 'Settings saved',
                description: 'Your preferences have been updated.',
              })
            }}
            className="w-full rounded-2xl bg-[#111827] text-white hover:bg-[#1f2937] disabled:opacity-50"
          >
            Save changes
          </Button>
        </div>
      </div>
    </>
  )
}
