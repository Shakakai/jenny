import { useNavigate } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import type { Project, ProjectStatus } from '../types/project'
import { formatRelativeTime } from '../lib/time'
import { cn } from '../lib/utils'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-zinc-700 text-zinc-300',
  },
  generated: {
    label: 'Generated',
    className: 'bg-amber-900/50 text-amber-300 border border-amber-700/50',
  },
  ready: {
    label: 'Ready',
    className: 'bg-green-900/50 text-green-300 border border-green-700/50',
  },
}

export default function ProjectCard({ project, onDelete, onRename }: ProjectCardProps) {
  const navigate = useNavigate()
  const status = statusConfig[project.status]

  function handleCardClick() {
    navigate(`/projects/${project.id}`)
  }

  function handleRename(e: React.MouseEvent) {
    e.stopPropagation()
    const newName = window.prompt('Enter new project name:', project.name)
    if (newName && newName.trim()) {
      onRename(project.id, newName.trim())
    }
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      onDelete(project.id)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors cursor-pointer"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-zinc-100 font-medium text-sm leading-snug flex-1 min-w-0 truncate">
          {project.name}
        </h3>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 text-zinc-400 hover:text-zinc-100 transition-colors p-0.5 rounded"
              aria-label="Project options"
            >
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-32 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl p-1 z-50"
              sideOffset={4}
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu.Item
                className="flex items-center px-2 py-1.5 text-sm text-zinc-200 rounded cursor-pointer hover:bg-zinc-700 outline-none"
                onSelect={(e) => {
                  e.preventDefault()
                  handleRename(e as unknown as React.MouseEvent)
                }}
              >
                Rename
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center px-2 py-1.5 text-sm text-red-400 rounded cursor-pointer hover:bg-zinc-700 outline-none"
                onSelect={(e) => {
                  e.preventDefault()
                  handleDelete(e as unknown as React.MouseEvent)
                }}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Customer context — 2 lines max */}
      <p
        className="text-zinc-400 text-xs mb-3"
        style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {project.customer_context}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            status.className
          )}
        >
          {status.label}
        </span>
        <span className="text-xs text-zinc-500">
          {formatRelativeTime(project.updated_at)}
        </span>
      </div>
    </div>
  )
}
