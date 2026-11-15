import Reveal from '../ui/Reveal'
import SplitText from '../ui/SplitText'

const pillars = [
  {
    title: 'Net-zero by design',
    text: 'Solar, heat pumps and airtight envelopes bring running costs and emissions close to zero.',
  },
  {
    title: 'Forest-first sites',
    text: 'Homes are placed around existing trees and habitats, never the other way around.',
  },
  {
    title: 'Verified materials',
    text: 'FSC-certified timber, low-carbon concrete and reclaimed stone, documented for every build.',
  },
]

// Placeholder figures: replace with real ones before launch.
const stats = [
  { value: '100%', label: 'Certified timber' },
  { value: '−70%', label: 'Typical energy use' },
  { value: '3 : 1', label: 'Trees planted per tree moved' },
]

export default function Pillars() {
  return (
    <section id="why" className="bg-forest-900 py-28 text-ivory md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-glow">Why Eco Estate</p>
        <SplitText
          text="Luxury that leaves the forest standing."
          className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] md:text-6xl"
        />
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <div className="border-t border-ivory/25 pt-6">
                <p className="text-sm text-amber-glow">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ivory/70">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-20 grid gap-8 rounded-3xl bg-forest-950/60 p-10 md:grid-cols-3">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <p className="font-display text-6xl font-semibold text-sage-300">{s.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ivory/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
