import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store/useAppStore'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 475

const getFrameUrl = (index: number) => {
  const pad = String(index + 1).padStart(4, '0')
  return `/frames/frame_${pad}.jpg`
}

export default function HeroCanvasFrames() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneActive = useAppStore((s) => s.sceneActive)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null)
    const loaded: boolean[] = new Array(TOTAL_FRAMES).fill(false)

    let currentFrame = 0
    let targetFrame = 0
    let rafId: number
    let lastRenderedFrame = -1

    // Resize canvas with device pixel ratio for maximum sharpness
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      renderFrame(Math.round(currentFrame))
    }

    const renderFrame = (idx: number) => {
      // Find the closest loaded frame if target is not loaded yet
      let bestIdx = idx
      if (!loaded[bestIdx]) {
        let diff = 1
        while (diff < TOTAL_FRAMES) {
          if (idx - diff >= 0 && loaded[idx - diff]) {
            bestIdx = idx - diff
            break
          }
          if (idx + diff < TOTAL_FRAMES && loaded[idx + diff]) {
            bestIdx = idx + diff
            break
          }
          diff++
        }
      }

      const img = images[bestIdx]
      if (!img || !loaded[bestIdx]) return

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth || 1920
      const ih = img.naturalHeight || 1080

      const hRatio = cw / iw
      const vRatio = ch / ih
      const ratio = Math.max(hRatio, vRatio)

      const shiftX = (cw - iw * ratio) / 2
      const shiftY = (ch - ih * ratio) / 2

      ctx.drawImage(img, 0, 0, iw, ih, shiftX, shiftY, iw * ratio, ih * ratio)
      lastRenderedFrame = bestIdx
    }

    const loadFrame = (i: number): Promise<void> => {
      return new Promise((resolve) => {
        if (images[i]) {
          resolve()
          return
        }
        const img = new Image()
        img.src = getFrameUrl(i)
        img.onload = () => {
          images[i] = img
          loaded[i] = true
          if (i === 0 && lastRenderedFrame === -1) {
            renderFrame(0)
            useAppStore.setState({ ready: true })
          }
          resolve()
        }
        img.onerror = () => resolve()
      })
    }

    // Step 1: Preload the first 25 frames immediately so hero shows instantly
    const initialBatch = Array.from({ length: 25 }, (_, i) => loadFrame(i))
    Promise.all(initialBatch).then(() => {
      useAppStore.setState({ ready: true })
      renderFrame(0)

      // Step 2: Stream load the rest in background in small chunks
      let nextIndex = 25
      const loadNextChunk = () => {
        if (nextIndex >= TOTAL_FRAMES) return
        const batchEnd = Math.min(nextIndex + 20, TOTAL_FRAMES)
        const batch: Promise<void>[] = []
        for (let i = nextIndex; i < batchEnd; i++) {
          batch.push(loadFrame(i))
        }
        nextIndex = batchEnd
        Promise.all(batch).then(() => {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadNextChunk)
          } else {
            setTimeout(loadNextChunk, 16)
          }
        })
      }
      loadNextChunk()
    })

    // Safety fallback for preloader
    const fallbackTimer = setTimeout(() => {
      useAppStore.setState({ ready: true })
    }, 1200)

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // GSAP ScrollTrigger to map scroll to frame index
    const trigger = ScrollTrigger.create({
      trigger: '#journey',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        targetFrame = Math.min(Math.floor(self.progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)
        useAppStore.setState({
          journey: self.progress,
          sceneActive: self.progress < 0.99,
        })
      },
    })

    // 60fps render loop with smooth interpolation
    const loop = () => {
      const diff = targetFrame - currentFrame
      if (Math.abs(diff) > 0.05) {
        currentFrame += diff * 0.25
        const frameToDraw = Math.round(currentFrame)
        if (frameToDraw !== lastRenderedFrame) {
          renderFrame(frameToDraw)
        }
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      clearTimeout(fallbackTimer)
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      trigger.kill()
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 ease-out ${
        sceneActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full block object-cover" />
      {/* Subtle vignette for crisp typography contrast */}
      <div className="absolute inset-0 bg-forest-950/20 pointer-events-none" />
    </div>
  )
}
