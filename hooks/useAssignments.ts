'use client'

import { useAssignmentStore } from '@/store/assignments'

export const useAssignments = () => {
  return useAssignmentStore()
}
