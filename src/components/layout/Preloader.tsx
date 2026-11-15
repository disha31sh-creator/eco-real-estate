import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useAppStore } from '../../store/useAppStore'

export default function Preloader() {
  const ready = useAppStore((s) => s.ready)
  const ref = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!ready) return
    gsap.to(ref.current, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut', onComplete: () => setGone(true) })
  }, [ready])

  if (gone) return null
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-forest-950 text-ivory"
    >
      <p className="font-display text-4xl tracking-tight">Eco Estate</p>
      <div className="mt-8 h-px w-48 overflow-hidden bg-ivory/20">
        <div className="h-full w-full origin-left animate-[load_1.6s_ease-in-out_infinite] bg-amber-glow" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.4em] text-ivory/50">Entering the forest</p>
    </div>
  )
}
