import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useAppStore } from '../../store/useAppStore'
import { Leaf } from '../ui/Icons'

const links = [
  { label: 'Journey', href: '#journey' },
  { label: 'Homes', href: '#properties' },
  { label: 'Why Eco', href: '#why' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const ref = useRef<HTMLElement>(null)
  const ready = useAppStore((s) => s.ready)

  useLayoutEffect(() => {
    gsap.set(ref.current, { y: -80, autoAlpha: 0 })
  }, [])

  useEffect(() => {
    if (!ready) return
    gsap.to(ref.current, { y: 0, autoAlpha: 1, duration: 1, delay: 0.6, ease: 'power3.out' })
  }, [ready])

  return (
    <header
      ref={ref}
      className="fixed inset-x-4 top-4 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full bg-ivory/80 px-6 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      <a href="#journey" className="flex items-center gap-2 font-display text-xl font-semibold text-forest-700">
        <Leaf /> Eco Estate
      </a>
      <nav className="hidden items-center gap-8 text-sm font-medium text-forest-900 md:flex">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="transition-colors hover:text-forest-600">
            {l.label}
          </a>
        ))}
      </nav>
      <a
        href="#contact"
        className="rounded-full bg-forest-700 px-5 py-2 text-sm font-medium text-ivory transition-colors hover:bg-forest-600"
      >
        Book a viewing
      </a>
    </header>
  )
}
