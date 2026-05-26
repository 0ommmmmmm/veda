'use client'

import { Topbar } from '@/components/vedaai/Topbar'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  return (
    <>
      <Topbar title="Profile" showBack={true} />
      <div className="pt-28 px-8 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* User Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f05a3c] to-[#d64828] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white">John Doe</h2>
                <p className="text-gray-600 dark:text-gray-400">Teacher</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">john.doe@dps.edu.in</p>
              </div>
            </div>
            <Button className="gradient-btn gradient-btn-primary w-full">Edit Profile</Button>
          </div>

          {/* School Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">School Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">School Name</span>
                <span className="text-black dark:text-white font-medium">Delhi Public School</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="text-gray-600 dark:text-gray-400">Location</span>
                <span className="text-black dark:text-white font-medium">Sector-4, Bokaro</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="text-gray-600 dark:text-gray-400">Role</span>
                <span className="text-black dark:text-white font-medium">Teacher</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email</span>
                <span className="text-black dark:text-white font-medium">john.doe@dps.edu.in</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-black dark:text-white font-medium">May 26, 2024</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="text-gray-600 dark:text-gray-400">Account Status</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
