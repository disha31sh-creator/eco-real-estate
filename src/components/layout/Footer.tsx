import { Leaf } from '../ui/Icons'

export default function Footer() {
  return (
    <footer className="relative z-10 bg-forest-950 px-6 pb-10 pt-4 text-ivory/70">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-ivory/15 pt-12 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-display text-xl font-semibold text-ivory">
            <Leaf /> Eco Estate
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Architectural homes that belong to the forest. Placeholder copy for the first version.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-ivory/40">Explore</p>
          <ul className="space-y-2">
            <li><a href="#journey" className="hover:text-ivory">Journey</a></li>
            <li><a href="#properties" className="hover:text-ivory">Homes</a></li>
            <li><a href="#why" className="hover:text-ivory">Why Eco Estate</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-ivory/40">Contact</p>
          <p>hello@ecoestate.example</p>
          <p className="mt-2">+00 000 000 0000</p>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs text-ivory/40">© 2026 Eco Estate. All rights reserved.</p>
    </footer>
  )
}
