import { useRef, useState, type PointerEvent } from 'react'
import gsap from 'gsap'
import type { Property } from '../../types'
import PropertyView from '../three/PropertyView'
import { Arrow } from './Icons'

// A card with a live 3D house on top. It tilts toward the pointer and the 3D camera pushes in on hover.
export default function PropertyCard({ property }: { property: Property }) {
  const card = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(card.current, {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 1000,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const onLeave = () => {
    setHovered(false)
    gsap.to(card.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
  }

  return (
    <div className="property-card">
      <article
        ref={card}
        onPointerMove={onMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={onLeave}
        className="overflow-hidden rounded-3xl bg-ivory shadow-[0_30px_70px_-30px_rgba(15,36,18,0.45)]"
      >
        <PropertyView
          variant={property.variant}
          image={property.image}
          hovered={hovered}
          className="aspect-[4/3] w-full"
        />
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-forest-600">{property.location}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-forest-900">{property.name}</h3>
          <p className="mt-1 text-lg text-forest-700">{property.price}</p>
          <p className="mt-4 text-sm text-forest-900/70">
            {property.beds} bed · {property.baths} bath · {property.area} m²
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-mint-100 px-3 py-1 text-xs font-medium text-forest-700">
                {tag}
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-forest-600"
          >
            View home <Arrow />
          </a>
        </div>
      </article>
    </div>
  )
}
