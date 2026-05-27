import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'light' | 'dark'
export type DifficultyPreference = 'Easy' | 'Moderate' | 'Hard'

export interface UserSettings {
  teacherName: string
  email: string
  schoolName: string
  location: string

  theme: ThemePreference
  notificationsEnabled: boolean
  defaultDifficulty: DifficultyPreference
  defaultMarksPerQuestion: number
}

interface SettingsStore {
  settings: UserSettings
  updateSettings: (updates: Partial<UserSettings>) => void
  setSettings: (next: UserSettings) => void
}

const DEFAULT_SETTINGS: UserSettings = {
  teacherName: 'John Doe',
  email: 'john.doe@school.com',
  schoolName: 'Delhi Public School',
  location: 'Bokaro Steel City',
  theme: 'light',
  notificationsEnabled: true,
  defaultDifficulty: 'Moderate',
  defaultMarksPerQuestion: 1,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
      setSettings: (next) => set({ settings: next }),
    }),
    {
      name: 'vedaai-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)

