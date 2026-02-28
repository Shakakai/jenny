import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { useProjectsStore } from '../store/projects'
import * as api from '../lib/api'
import ProjectCard from '../components/ProjectCard'
import ErrorBoundary from '../components/ErrorBoundary'

function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-4 w-4 bg-zinc-800 rounded shrink-0" />
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 bg-zinc-800 rounded-full" />
        <div className="h-3 w-20 bg-zinc-800 rounded" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { projects, isLoading, error, fetchProjects, removeProject, updateProjectInStore } =
    useProjectsStore()

  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects])

  async function handleDelete(id: string) {
    try {
      await api.deleteProject(id)
      removeProject(id)
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  }

  async function handleRename(id: string, newName: string) {
    try {
      const updated = await api.updateProject(id, { name: newName })
      updateProjectInStore(updated)
    } catch (err) {
      console.error('Failed to rename project:', err)
    }
  }

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col p-6">
        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-800 text-red-300 rounded-md text-sm flex items-center gap-3">
            <span>Could not load projects.</span>
            <button
              onClick={() => void fetchProjects()}
              className="underline hover:text-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
            <LayoutGrid size={48} className="text-violet-500/60" />
            <div>
              <h2 className="text-zinc-100 text-xl font-semibold mb-1">No projects yet</h2>
              <p className="text-zinc-400 text-sm">
                Create your first agent-based model to get started.
              </p>
            </div>
            <button
              onClick={() => navigate('/projects/new')}
              className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              New Project
            </button>
          </div>
        )}

        {/* Populated state */}
        {!isLoading && projects.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-zinc-100 text-2xl font-bold">Your Projects</h1>
              <button
                onClick={() => navigate('/projects/new')}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                New Project
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={(id) => void handleDelete(id)}
                  onRename={(id, name) => void handleRename(id, name)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}
