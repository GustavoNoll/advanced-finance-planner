import { motion, type Transition } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
  className?: string
  transition?: Transition
}

export function PageTransition({ children, className, transition }: PropsWithChildren<PageTransitionProps>) {
  const [shouldReduce, setShouldReduce] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setShouldReduce(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  const effectiveTransition: Transition = transition ?? {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1]
  }

  return (
    <motion.div
      className={className}
      initial={shouldReduce ? false : { opacity: 0, y: 8 }}
      animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={effectiveTransition}
    >
      {children}
    </motion.div>
  )
}


