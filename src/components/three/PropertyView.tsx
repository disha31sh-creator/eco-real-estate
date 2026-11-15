import { useEffect, useRef, useState } from 'react'
import type { HouseVariant } from '../../types'

interface Props {
  variant?: HouseVariant
  image?: string
  hovered?: boolean
  className?: string
}

const DEFAULT_IMAGES: Record<HouseVariant, string> = {
  cedar: '/images/properties/cedar-ridge.jpg',
  glass: '/images/properties/willow-glass.jpg',
  cabin: '/images/properties/moss-hollow.jpg',
}

export default function PropertyView({
  variant = 'cedar',
  image,
  hovered = false,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [internalHover, setInternalHover] = useState(false)

  const isHovered = hovered || internalHover
  const imgSrc = image || DEFAULT_IMAGES[variant] || DEFAULT_IMAGES.cedar

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0
    let rafId: number
    const startTime = performance.now()

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      // Normalised coordinates -1 to 1
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1

      // Dynamic light glare shift across the facade
      if (shineRef.current) {
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100
        shineRef.current.style.background = `radial-gradient(circle 260px at ${xPercent}% ${yPercent}%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 70%)`
      }
    }

    const onPointerEnter = () => {
      setInternalHover(true)
    }

    const onPointerLeave = () => {
      setInternalHover(false)
      mouseX = 0
      mouseY = 0
      if (shineRef.current) {
        shineRef.current.style.background = 'transparent'
      }
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerenter', onPointerEnter)
    container.addEventListener('pointerleave', onPointerLeave)

    // Render loop: smooth damping + organic breathing wave
    const update = () => {
      const now = performance.now()
      const t = (now - startTime) / 1000

      // Damped mouse follow
      currentX += (mouseX - currentX) * 0.08
      currentY += (mouseY - currentY) * 0.08

      // Idle subtle breathing wave (sinusoidal organic float)
      const idleTiltY = Math.sin(t * 0.8) * 1.5
      const idleTiltX = Math.cos(t * 0.7) * 1.2

      const rotY = currentX * 12 + idleTiltY
      const rotX = -currentY * 9 + idleTiltX

      if (imageRef.current) {
        imageRef.current.style.transform = `
          perspective(900px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          scale(${isHovered ? 1.08 : 1.03})
        `
      }

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)

    return () => {
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerenter', onPointerEnter)
      container.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(rafId)
    }
  }, [isHovered])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-pointer select-none bg-forest-950 ${className}`}
    >
      <img
        ref={imageRef}
        src={imgSrc}
        alt="Eco Estate residence"
        className="h-full w-full object-cover object-center will-change-transform transition-[transform,filter] duration-300 ease-out"
        loading="lazy"
      />
      {/* Dynamic light reflection sweep */}
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
      />
      {/* Subtle depth vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-forest-950/15" />
    </div>
  )
}
