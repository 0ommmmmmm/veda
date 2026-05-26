'use client'

import { Topbar } from '@/components/vedaai/Topbar'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" showBack={true} />
      <div className="pt-28 px-8 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Profile Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="john.doe@school.com"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">School Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Name</label>
                <input
                  type="text"
                  defaultValue="Delhi Public School"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  defaultValue="Sector-4, Bokaro"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Assignment reminders</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Marketing emails</span>
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Appearance</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="theme" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Light</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="theme" className="w-4 h-4" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Dark</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="theme" className="w-4 h-4" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">System</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button className="w-full gradient-btn gradient-btn-primary">Save Changes</Button>
        </div>
      </div>
    </>
  )
}
