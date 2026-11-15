import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store/useAppStore'

gsap.registerPlugin(ScrollTrigger)

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneActive = useAppStore((s) => s.sceneActive)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let isSeeking = false
    let targetTime = 0

    const markReady = () => {
      useAppStore.setState({ ready: true })
    }

    if (video.readyState >= 2) {
      markReady()
    } else {
      video.addEventListener('loadeddata', markReady, { once: true })
      video.addEventListener('canplay', markReady, { once: true })
    }

    // Safety fallback so preloader always lifts
    const fallbackTimer = setTimeout(markReady, 1200)

    const onSeeked = () => {
      isSeeking = false
      if (video.duration && Math.abs(video.currentTime - targetTime) > 0.04) {
        isSeeking = true
        video.currentTime = targetTime
      }
    }

    video.addEventListener('seeked', onSeeked)

    // Sync with Journey scroll section
    const trigger = ScrollTrigger.create({
      trigger: '#journey',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        if (!video.duration) return
        targetTime = self.progress * video.duration
        if (!isSeeking) {
          isSeeking = true
          video.currentTime = targetTime
        }
      },
    })

    return () => {
      clearTimeout(fallbackTimer)
      video.removeEventListener('loadeddata', markReady)
      video.removeEventListener('canplay', markReady)
      video.removeEventListener('seeked', onSeeked)
      trigger.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 transition-opacity duration-700 ease-out ${
        sceneActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        playsInline
        muted
        preload="auto"
        className="h-full w-full object-cover"
      />
      {/* Subtle vignette so white text remains readable across all frames */}
      <div className="absolute inset-0 bg-forest-950/20 pointer-events-none" />
    </div>
  )
}
