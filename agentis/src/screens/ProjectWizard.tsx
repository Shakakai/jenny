import { useNavigate } from 'react-router-dom'

export default function ProjectWizard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="text-zinc-500 text-sm">
        Project Wizard — Coming in Phase 2
      </div>
      <button
        onClick={() => navigate('/')}
        className="text-violet-400 hover:text-violet-300 text-sm underline"
      >
        ← Back to Dashboard
      </button>
    </div>
  )
}
