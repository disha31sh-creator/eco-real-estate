import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store/useAppStore'
import Button from '../ui/Button'
import SplitText from '../ui/SplitText'

gsap.registerPlugin(ScrollTrigger)

// The tall hero section. While you scroll through it the 3D camera flies through the forest
// (see CameraRig) and these text chapters fade in and out on top.
export default function Journey() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) =>
            useAppStore.setState({ journey: self.progress, sceneActive: self.progress < 0.99 }),
        },
      })

      // chapter 1: the title zooms toward us and dissolves
      tl.to(q('[data-cue]'), { autoAlpha: 0, duration: 0.04 }, 0)
      tl.to(q('[data-ch="1"]'), { scale: 1.5, autoAlpha: 0, filter: 'blur(14px)', duration: 0.14 }, 0.04)

      // chapter 2: the path
      tl.fromTo(q('[data-ch="2"]'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.2)
      tl.fromTo(
        q('[data-ch="2"] .split-inner'),
        { yPercent: 115, rotate: 5 },
        { yPercent: 0, rotate: 0, stagger: 0.012, duration: 0.07 },
        0.2,
      )
      tl.to(q('[data-ch="2"]'), { autoAlpha: 0, y: -60, duration: 0.08 }, 0.4)

      // chapter 3: the reveal
      tl.fromTo(
        q('[data-ch="3"]'),
        { autoAlpha: 0, scale: 0.92, y: 40 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.1 },
        0.52,
      )
      tl.fromTo(
        q('[data-ch="3"] .split-inner'),
        { yPercent: 115, rotate: 5 },
        { yPercent: 0, rotate: 0, stagger: 0.01, duration: 0.07 },
        0.53,
      )
      tl.to(q('[data-ch="3"]'), { autoAlpha: 0, scale: 1.08, duration: 0.08 }, 0.78)

      // the scene dissolves into the ivory page below
      tl.fromTo(q('[data-fade]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.94)

      // stretch the timeline to exactly 1 so it maps cleanly onto the scroll distance
      tl.to({}, { duration: 0.0001 }, 0.9999)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="journey" ref={root} className="relative h-[620vh]">
      <div className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/45 via-transparent to-forest-950/55" />

        {/* chapter 1 */}
        <div
          data-ch="1"
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ivory will-change-transform"
        >
          <p className="mb-6 text-xs uppercase tracking-[0.5em] text-amber-glow md:text-sm">
            Forest living, reimagined
          </p>
          <SplitText
            as="h1"
            mode="load"
            text="Eco Estate"
            delay={0.4}
            className="font-display text-[clamp(4.5rem,15vw,14rem)] font-semibold leading-[0.9] tracking-tight [text-shadow:0_4px_50px_rgba(0,0,0,0.45)]"
          />
          <p className="mt-8 max-w-xl text-base text-ivory/85 md:text-xl">
            Architectural homes that belong to the forest. Scroll to step inside.
          </p>
        </div>

        <div data-cue className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-ivory">
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-ivory/25">
            <span className="absolute inset-0 animate-[cue_1.8s_ease-in-out_infinite] bg-ivory" />
          </span>
        </div>

        {/* chapter 2 */}
        <div data-ch="2" className="absolute bottom-[14vh] left-6 max-w-xl text-ivory md:left-16">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-glow">01 / The path</p>
          <SplitText
            as="h2"
            mode="manual"
            text="Mist, moss and cedar."
            className="font-display text-5xl font-semibold leading-tight md:text-7xl [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
          />
          <p className="mt-5 max-w-md text-ivory/85 md:text-lg">
            Every Eco Estate home begins with a walk. Follow the trail between the trees.
          </p>
        </div>

        {/* chapter 3 */}
        <div data-ch="3" className="absolute inset-0 flex flex-col justify-center px-6 text-ivory md:px-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-glow">02 / The reveal</p>
            <SplitText
              as="h2"
              mode="manual"
              text="Find eco-friendly homes easily."
              className="font-display text-5xl font-semibold leading-[1.02] md:text-8xl [text-shadow:0_2px_40px_rgba(0,0,0,0.55)]"
            />
            <p className="mt-6 max-w-lg text-ivory/90 md:text-lg">
              Hand-picked, low-impact residences set deep in protected woodland.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#properties" variant="light">
                Browse homes
              </Button>
              <Button href="#contact" variant="ghost">
                Book a viewing
              </Button>
            </div>
          </div>
        </div>

        {/* fade to the ivory page */}
        <div data-fade className="absolute inset-0 bg-ivory" />
      </div>
    </section>
  )
}
