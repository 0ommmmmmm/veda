import {
  normalizeAssignment,
  type AssignmentApiResponse,
} from './assignmentUtils'
import type { Assignment, CreateAssignmentPayload } from './types'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://veda-pn8n.onrender.com'
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (res.status === 204) {
    return undefined as T
  }

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error: string }).error)
        : 'Request failed'
    throw new ApiError(res.status, message, body)
  }

  return body as T
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const data = await apiFetch<{ status: string }>('/health')
    return data.status === 'ok'
  } catch {
    return false
  }
}

export async function getAssignments(): Promise<Assignment[]> {
  const data = await apiFetch<AssignmentApiResponse[]>('/api/assignments')
  return data.map(normalizeAssignment)
}

export async function getAssignmentById(id: string): Promise<Assignment> {
  const data = await apiFetch<AssignmentApiResponse>(`/api/assignments/${id}`)
  return normalizeAssignment(data)
}

export async function createAssignment(
  payload: CreateAssignmentPayload
): Promise<Assignment> {
  const data = await apiFetch<AssignmentApiResponse>('/api/assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return normalizeAssignment(data)
}

export async function deleteAssignment(id: string): Promise<void> {
  await apiFetch<void>(`/api/assignments/${id}`, { method: 'DELETE' })
}

export async function regenerateAssignment(id: string): Promise<Assignment> {
  const data = await apiFetch<AssignmentApiResponse>(
    `/api/assignments/${id}/regenerate`,
    { method: 'POST' }
  )
  return normalizeAssignment(data)
}
