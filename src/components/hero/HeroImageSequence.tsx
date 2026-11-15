import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store/useAppStore'

gsap.registerPlugin(ScrollTrigger)

const FRAMES = [
  '/images/hero/frame-1.jpg',
  '/images/hero/frame-2.jpg',
  '/images/hero/frame-3.jpg',
  '/images/hero/frame-4.jpg',
  '/images/hero/frame-5.jpg',
  '/images/hero/frame-6.jpg',
  '/images/hero/frame-7.jpg',
]

export default function HeroImageSequence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const sceneActive = useAppStore((s) => s.sceneActive)

  useEffect(() => {
    // Preload all images and signal ready
    let loadedCount = 0

    const onImageLoaded = () => {
      loadedCount++
      if (loadedCount >= 2) {
        // As soon as the first couple of images are ready, dismiss preloader
        useAppStore.setState({ ready: true })
      }
    }

    FRAMES.forEach((src) => {
      const img = new Image()
      img.src = src
      if (img.complete) {
        onImageLoaded()
      } else {
        img.onload = onImageLoaded
        img.onerror = onImageLoaded
      }
    })

    // Fallback safety
    const timer = setTimeout(() => useAppStore.setState({ ready: true }), 1000)

    // GSAP ScrollTrigger timeline to crossfade and dolly through the frames
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#journey',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            useAppStore.setState({
              journey: self.progress,
              sceneActive: self.progress < 0.99,
            })
          },
        },
      })

      const n = FRAMES.length
      // Set initial states: first visible, others invisible
      imageRefs.current.forEach((el, idx) => {
        if (!el) return
        gsap.set(el, {
          autoAlpha: idx === 0 ? 1 : 0,
          scale: 1,
        })
      })

      // Create smooth overlapping crossfades with gentle push-in
      for (let i = 0; i < n - 1; i++) {
        const start = i / (n - 0.8)
        const end = (i + 1) / (n - 0.8)
        const current = imageRefs.current[i]
        const next = imageRefs.current[i + 1]

        if (current && next) {
          // Push current forward as it fades
          tl.to(
            current,
            {
              scale: 1.08,
              autoAlpha: 0,
              ease: 'power1.inOut',
              duration: end - start,
            },
            start,
          )

          // Fade next in smoothly
          tl.fromTo(
            next,
            { autoAlpha: 0, scale: 0.96 },
            {
              autoAlpha: 1,
              scale: 1,
              ease: 'power1.inOut',
              duration: end - start,
            },
            start,
          )
        }
      }

      // Final frame subtle zoom at the end
      const last = imageRefs.current[n - 1]
      if (last) {
        tl.to(last, { scale: 1.06, ease: 'none', duration: 0.15 }, (n - 1) / (n - 0.8))
      }
    }, containerRef)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 ease-out ${
        sceneActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden="true"
    >
      {FRAMES.map((src, idx) => (
        <div
          key={src}
          ref={(el) => {
            imageRefs.current[idx] = el
          }}
          className="absolute inset-0 will-change-[transform,opacity]"
          style={{ opacity: idx === 0 ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover object-center"
            loading={idx <= 1 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Subtle cinematic gradient for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/35 via-transparent to-forest-950/50 pointer-events-none" />
    </div>
  )
}
