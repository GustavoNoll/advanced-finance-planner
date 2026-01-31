// 1. Imports externos
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 2. Imports internos (shared)
import { useLastActive } from '@/hooks/useLastActive'

// 3. Types
interface ActivityTrackerProps {
  children: React.ReactNode
}

// 4. Component
export function ActivityTracker({ children }: ActivityTrackerProps) {
  const location = useLocation()
  const { updateLastActive } = useLastActive()

  // Update last_active_at when route changes
  useEffect(() => {
    updateLastActive()
  }, [location.pathname, updateLastActive])

  return <>{children}</>
}
