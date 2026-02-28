import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'

const Dashboard = lazy(() => import('./screens/Dashboard'))
const ProjectWizard = lazy(() => import('./screens/ProjectWizard'))
const Workspace = lazy(() => import('./screens/Workspace'))
const Settings = lazy(() => import('./screens/Settings'))

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects/new" element={<ProjectWizard />} />
              <Route path="/projects/:id" element={<Workspace />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
