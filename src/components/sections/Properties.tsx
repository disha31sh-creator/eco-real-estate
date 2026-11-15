import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { properties } from '../../data/properties'
import PropertyCard from '../ui/PropertyCard'
import SplitText from '../ui/SplitText'

gsap.registerPlugin(ScrollTrigger)

export default function Properties() {
  const grid = useRef<HTMLDivElement>(null)

  // cards swing up out of the depth of the page
  useLayoutEffect(() => {
    const el = grid.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = el.querySelectorAll('.property-card')
    const tween = gsap.fromTo(
      cards,
      { y: 140, rotateX: 28, autoAlpha: 0, transformPerspective: 1000, transformOrigin: '50% 100%' },
      {
        y: 0,
        rotateX: 0,
        autoAlpha: 1,
        duration: 1.3,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section id="properties" className="bg-mint-100 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-4 text-center text-xs uppercase tracking-[0.4em] text-forest-600">Featured residences</p>
        <SplitText
          text="Homes shaped by the land"
          className="text-center font-display text-5xl font-semibold text-forest-900 md:text-6xl"
        />
        <div ref={grid} className="mt-16 grid gap-8 md:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
