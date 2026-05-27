import { create } from 'zustand'
import type {
  Assignment,
  CreateAssignmentPayload,
  GenerationStatus,
  QuestionPaper,
} from '@/lib/types'
import { mockAssignments } from '@/lib/mock-data'
import * as api from '@/lib/api'

interface AssignmentStore {
  assignments: Assignment[]
  currentAssignment: Assignment | null
  loading: boolean
  error: string | null
  isUsingMockFallback: boolean

  setAssignments: (assignments: Assignment[]) => void
  addAssignment: (assignment: Assignment) => void
  updateAssignment: (id: string, updates: Partial<Assignment>) => void
  deleteAssignment: (id: string) => Promise<void>
  setCurrentAssignment: (assignment: Assignment | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void

  fetchAssignments: () => Promise<void>
  fetchAssignmentById: (
    id: string,
    options?: { silent?: boolean }
  ) => Promise<Assignment | null>
  createAssignment: (payload: CreateAssignmentPayload) => Promise<Assignment>
  regenerateAssignment: (id: string) => Promise<Assignment>
  applyGenerationUpdate: (
    assignmentId: string,
    updates: {
      generationStatus?: GenerationStatus
      questionPaper?: QuestionPaper
      generationError?: string
    }
  ) => void
}

function mergeAssignmentInList(
  assignments: Assignment[],
  updated: Assignment
): Assignment[] {
  const index = assignments.findIndex((a) => a.id === updated.id)
  if (index === -1) {
    return [updated, ...assignments]
  }
  const next = [...assignments]
  next[index] = { ...next[index], ...updated }
  return next
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  currentAssignment: null,
  loading: false,
  error: null,
  isUsingMockFallback: false,

  setAssignments: (assignments) => set({ assignments }),

  addAssignment: (assignment) =>
    set((state) => ({
      assignments: [assignment, ...state.assignments],
    })),

  updateAssignment: (id, updates) =>
    set((state) => {
      const assignments = state.assignments.map((assignment) =>
        assignment.id === id ? { ...assignment, ...updates } : assignment
      )
      const currentAssignment =
        state.currentAssignment?.id === id
          ? { ...state.currentAssignment, ...updates }
          : state.currentAssignment
      return { assignments, currentAssignment }
    }),

  deleteAssignment: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.deleteAssignment(id)
      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id),
        currentAssignment:
          state.currentAssignment?.id === id ? null : state.currentAssignment,
        loading: false,
      }))
    } catch (err) {
      const message =
        err instanceof api.ApiError ? err.message : 'Failed to delete assignment'
      set({ loading: false, error: message })
      throw err
    }
  },

  setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  resetStore: () =>
    set({
      currentAssignment: null,
      loading: false,
      error: null,
      isUsingMockFallback: false,
    }),

  fetchAssignments: async () => {
    set({ loading: true, error: null })
    try {
      const assignments = await api.getAssignments()
      set({
        assignments,
        loading: false,
        isUsingMockFallback: false,
      })
    } catch {
      set({
        assignments: mockAssignments,
        loading: false,
        error: 'Backend unavailable. Showing sample assignments.',
        isUsingMockFallback: true,
      })
    }
  },

  fetchAssignmentById: async (id, options) => {
    const silent = options?.silent ?? false
    if (!silent) {
      set({ loading: true, error: null })
    }
    try {
      const assignment = await api.getAssignmentById(id)
      if (silent) {
        console.log(
          '[store] GET /api/assignments/:id (silent)',
          id,
          assignment.generationStatus,
          assignment.questionPaper?.sections?.length ?? 0
        )
      }
      set((state) => ({
        currentAssignment: assignment,
        assignments: mergeAssignmentInList(state.assignments, assignment),
        loading: silent ? state.loading : false,
        isUsingMockFallback: false,
      }))
      return assignment
    } catch {
      const cached = get().assignments.find((a) => a.id === id)
      const mock = mockAssignments.find((a) => a.id === id)
      const assignment = cached ?? mock ?? null
      set((state) => ({
        currentAssignment: assignment,
        loading: silent ? state.loading : false,
        error: assignment
          ? null
          : 'Assignment not found. Backend may be unavailable.',
        isUsingMockFallback: !assignment || !!mock,
      }))
      return assignment
    }
  },

  createAssignment: async (payload) => {
    set({ loading: true, error: null })
    try {
      const assignment = await api.createAssignment(payload)
      set((state) => ({
        assignments: [assignment, ...state.assignments],
        currentAssignment: assignment,
        loading: false,
        isUsingMockFallback: false,
      }))
      return assignment
    } catch (err) {
      const message =
        err instanceof api.ApiError
          ? err.message
          : 'Failed to create assignment'
      set({ loading: false, error: message })
      throw err
    }
  },

  regenerateAssignment: async (id) => {
    set({ loading: true, error: null })
    try {
      const assignment = await api.regenerateAssignment(id)
      set((state) => ({
        assignments: mergeAssignmentInList(state.assignments, assignment),
        currentAssignment:
          state.currentAssignment?.id === id
            ? assignment
            : state.currentAssignment,
        loading: false,
      }))
      return assignment
    } catch (err) {
      const message =
        err instanceof api.ApiError
          ? err.message
          : 'Failed to regenerate assignment'
      set({ loading: false, error: message })
      throw err
    }
  },

  applyGenerationUpdate: (assignmentId, updates) => {
    set((state) => {
      const patch = (a: Assignment): Assignment => {
        if (a.id !== assignmentId) return a
        const next = { ...a, ...updates }
        if (updates.questionPaper !== undefined) {
          next.questionPaper = updates.questionPaper
        }
        if (updates.generationStatus === 'completed') {
          next.generationError = undefined
        }
        if (updates.generationStatus === 'failed' && updates.generationError) {
          next.generationError = updates.generationError
        }
        return next
      }

      const assignments = state.assignments.map(patch)
      const currentAssignment = state.currentAssignment
        ? patch(state.currentAssignment)
        : null

      return { assignments, currentAssignment }
    })
  },
}))
