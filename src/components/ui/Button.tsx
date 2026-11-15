import type { ReactNode } from 'react'
import { Arrow } from './Icons'

interface Props {
  href?: string
  variant?: 'solid' | 'light' | 'ghost' | 'ghost-dark'
  children: ReactNode
  className?: string
}

const styles: Record<NonNullable<Props['variant']>, string> = {
  solid: 'bg-forest-700 text-ivory hover:bg-forest-600',
  light: 'bg-ivory text-forest-900 hover:bg-white',
  ghost: 'border border-ivory/60 text-ivory hover:bg-ivory/10',
  'ghost-dark': 'border border-forest-700/40 text-forest-900 hover:bg-forest-700/10',
}

export default function Button({ href = '#', variant = 'solid', children, className = '' }: Props) {
  return (
    <a
      href={href}
      className={`pointer-events-auto inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${styles[variant]} ${className}`}
    >
      {children}
      <Arrow />
    </a>
  )
}
