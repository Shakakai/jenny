import { create } from 'zustand'
import type { Project } from '../types/project'
import * as api from '../lib/api'

interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null

  fetchProjects: () => Promise<void>
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProjectInStore: (project: Project) => void
  clearError: () => void
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const projects = await api.listProjects()
      set({ projects, isLoading: false })
    } catch (err) {
      const message = err instanceof api.ApiError
        ? err.detail
        : 'Failed to load projects'
      set({ isLoading: false, error: message })
      console.error('fetchProjects failed:', err)
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id
        ? null
        : state.currentProject,
    })),

  updateProjectInStore: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => p.id === project.id ? project : p),
      currentProject: state.currentProject?.id === project.id
        ? project
        : state.currentProject,
    })),

  clearError: () => set({ error: null }),
}))
