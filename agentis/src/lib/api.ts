/**
 * Typed API client for the Agentis FastAPI backend.
 * Base URL: http://localhost:57431
 */

import type { Project, ProjectCreate, ProjectUpdate } from '../types/project'

const BASE_URL = 'http://localhost:57431'

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new ApiError(
      response.status,
      typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail)
    )
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

// Projects
export const listProjects = (): Promise<Project[]> =>
  request('/api/projects/')

export const createProject = (data: ProjectCreate): Promise<Project> =>
  request('/api/projects/', { method: 'POST', body: JSON.stringify(data) })

export const getProject = (id: string): Promise<Project> =>
  request(`/api/projects/${id}`)

export const updateProject = (id: string, data: ProjectUpdate): Promise<Project> =>
  request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteProject = (id: string): Promise<void> =>
  request(`/api/projects/${id}`, { method: 'DELETE' })

// Files
export const getProjectFile = (
  projectId: string,
  filename: 'model.py' | 'synthetic_data.csv' | 'model.py.original'
): Promise<string> =>
  fetch(`${BASE_URL}/api/projects/${projectId}/files/${filename}`)
    .then(r => {
      if (!r.ok) throw new ApiError(r.status, `Failed to fetch ${filename}`)
      return r.text()
    })

export const saveProjectFile = async (
  projectId: string,
  filename: 'model.py' | 'synthetic_data.csv',
  content: string
): Promise<void> => {
  const r = await fetch(
    `${BASE_URL}/api/projects/${projectId}/files/${filename}`,
    { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: content }
  )
  if (!r.ok) throw new ApiError(r.status, `Failed to save ${filename}`)
}

// Settings
export const setApiKey = (apiKey: string): Promise<{ status: string }> =>
  request('/api/settings/api-key', {
    method: 'POST',
    body: JSON.stringify({ api_key: apiKey }),
  })

export const getApiKeyStatus = (): Promise<{ configured: boolean }> =>
  request('/api/settings/api-key/status')

// LLM (stubs — implemented in Phase 2)
export const suggestProjectName = (data: {
  customer_context: string;
  objectives: string;
  viz_thoughts: string;
}): Promise<{ name: string }> =>
  request('/api/llm/suggest-name', { method: 'POST', body: JSON.stringify(data) })
