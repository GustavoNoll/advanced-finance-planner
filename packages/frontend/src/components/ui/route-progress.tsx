import { useEffect, useRef, useState } from 'react'
import { useNavigationType, useLocation } from 'react-router-dom'

export function RouteProgress() {
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const rafRef = useRef<number | null>(null)
  const location = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    // Start on path change
    setVisible(true)
    setWidth(15)

    const tick = () => {
      setWidth(prev => {
        if (prev >= 90) return prev
        const increment = prev < 60 ? 1.5 : prev < 80 ? 0.7 : 0.3
        return Math.min(prev + increment, 90)
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [location.pathname, navType])

  useEffect(() => {
    // Complete after a brief delay to emulate load finishing
    const timeout = setTimeout(() => {
      setWidth(100)
      const hide = setTimeout(() => {
        setVisible(false)
        setWidth(0)
      }, 220)
      return () => clearTimeout(hide)
    }, 350)
    return () => clearTimeout(timeout)
  }, [location.key])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-blue-600/80 transition-[width] duration-150 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}


