import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import SplitText from '../ui/SplitText'

export default function Cta() {
  return (
    <section id="contact" className="bg-forest-950 px-6 py-32 text-center text-ivory md:py-44">
      <p className="mb-6 text-xs uppercase tracking-[0.4em] text-amber-glow">Your move</p>
      <SplitText
        text="Your forest home is waiting."
        className="mx-auto max-w-4xl font-display text-6xl font-semibold leading-[1.02] md:text-8xl"
      />
      <Reveal delay={0.2} className="mt-12">
        <Button href="mailto:hello@ecoestate.example" variant="light">
          Book a private viewing
        </Button>
      </Reveal>
    </section>
  )
}
