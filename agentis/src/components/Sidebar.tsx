import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-200',
        collapsed ? 'w-16' : 'w-[220px]'
      )}
    >
      {/* Drag region / logo area */}
      <div
        data-tauri-drag-region
        className="flex items-center h-10 px-3 bg-zinc-900 shrink-0"
      >
        {collapsed ? (
          <div className="w-6 h-6 rounded-sm bg-violet-500 shrink-0" />
        ) : (
          <span className="text-zinc-100 font-semibold text-sm select-none">
            Agentis
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-2 pt-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-2 py-2 rounded-md transition-colors',
              isActive
                ? 'bg-zinc-800 text-violet-400'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
            )
          }
        >
          <Home size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm">Dashboard</span>}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-2 py-2 rounded-md transition-colors',
              isActive
                ? 'bg-zinc-800 text-violet-400'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
            )
          }
        >
          <Settings size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </NavLink>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center h-10 w-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  )
}
