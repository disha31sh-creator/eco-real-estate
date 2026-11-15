import { useLayoutEffect, useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store/useAppStore'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  /** load: plays once the preloader leaves. scroll: plays when scrolled into view.
   *  manual: another timeline animates the words (see Journey). */
  mode?: 'load' | 'scroll' | 'manual'
  delay?: number
}

// Splits a headline into words that slide up out of a mask.
export default function SplitText({ text, as = 'h2', className = '', mode = 'scroll', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const ready = useAppStore((s) => s.ready)
  const Tag = as as ElementType

  // Start hidden below the mask (set through GSAP, not inline CSS, so GSAP owns the transform).
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.set(el.querySelectorAll('.split-inner'), { yPercent: 115, rotate: 5 })
  }, [text])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || mode === 'manual') return
    if (mode === 'load' && !ready) return
    const inners = el.querySelectorAll('.split-inner')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(inners, { yPercent: 0, rotate: 0 })
      return
    }

    const tween = gsap.fromTo(
      inners,
      { yPercent: 115, rotate: 5 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.2,
        delay,
        ease: 'power4.out',
        stagger: 0.09,
        ...(mode === 'scroll' ? { scrollTrigger: { trigger: el, start: 'top 88%', once: true } } : {}),
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [mode, ready, delay, text])

  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: '0.14em', marginBottom: '-0.14em' }}
          >
            <span className="split-inner inline-block will-change-transform">{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
