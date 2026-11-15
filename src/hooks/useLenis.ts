import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../store/useAppStore'

gsap.registerPlugin(ScrollTrigger)

// One smooth-scroll engine for the whole site. GSAP's ticker drives Lenis so that
// scrolling, text animations and the 3D camera all stay in sync.
export function useLenis() {
  const ready = useAppStore((s) => s.ready)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.085, anchors: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Hold the page still behind the preloader, then release it.
  useEffect(() => {
    if (!ready) {
      lenisRef.current?.stop()
      return
    }
    lenisRef.current?.start()
    ScrollTrigger.refresh()
  }, [ready])
}
