import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { Project } from '../types/project'
import * as api from '../lib/api'
import { useProjectsStore } from '../store/projects'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Workspace() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setCurrentProject } = useProjectsStore()

  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    let cancelled = false

    api.getProject(id)
      .then((p) => {
        if (!cancelled) {
          setProject(p)
          setCurrentProject(p)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err instanceof api.ApiError && err.status === 404) {
            setNotFound(true)
          }
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
      setCurrentProject(null)
    }
  }, [id, navigate, setCurrentProject])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (notFound || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-zinc-400 text-sm">Project not found.</p>
        <button
          onClick={() => navigate('/')}
          className="text-violet-400 hover:text-violet-300 text-sm underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-zinc-100 font-medium">{project.name}</span>
      </div>

      {/* Stub content */}
      <div className="flex items-center justify-center flex-1 text-zinc-500 text-sm">
        Workspace — Coming in Phase 2
      </div>
    </div>
  )
}
