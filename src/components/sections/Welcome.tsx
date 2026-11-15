import Button from '../ui/Button'
import { Leaf } from '../ui/Icons'
import Reveal from '../ui/Reveal'
import SplitText from '../ui/SplitText'
import PropertyView from '../three/PropertyView'

export default function Welcome() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-28 md:grid-cols-2 md:py-36">
      <Reveal className="relative">
        <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_40px_90px_-30px_rgba(15,36,18,0.5)]">
          <PropertyView
            image="/images/properties/welcome-showcase.jpg"
            className="aspect-[4/3] w-full"
          />
        </div>
        <div className="absolute -left-5 -top-5 flex h-24 w-24 items-center justify-center rounded-full bg-forest-700 text-center text-xs font-medium leading-tight text-ivory shadow-xl">
          Find
          <br />
          Home
        </div>
        <div className="absolute -bottom-5 -right-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-amber-glow text-forest-900 shadow-xl">
          <Leaf className="h-7 w-7" />
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-forest-900/50">
          Move your pointer to turn the house
        </p>
      </Reveal>

      <div>
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-forest-600">Who we are</p>
        <SplitText
          text="Welcome to Eco Estate"
          className="font-display text-5xl font-semibold leading-[1.05] text-forest-900 md:text-6xl"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 text-lg leading-relaxed text-forest-900/75">
            We list only homes that tread lightly: net-zero designs, responsibly sourced timber and sites chosen to
            protect the woodland around them. Every residence is verified by our sustainability team before it
            reaches you.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="#properties">Explore homes</Button>
            <Button href="#why" variant="ghost-dark">
              How we verify
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
