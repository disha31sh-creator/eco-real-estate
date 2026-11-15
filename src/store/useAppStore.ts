import { create } from 'zustand'

export type Tier = 'high' | 'low'

// Quality tier: picks how heavy the 3D scene is.
// Add ?quality=high or ?quality=low to the address to force one.
function detectTier(): Tier {
  if (typeof window === 'undefined') return 'high'
  const forced = new URLSearchParams(window.location.search).get('quality')
  if (forced === 'high' || forced === 'low') return forced
  const small = window.matchMedia('(max-width: 767px)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency ?? 8
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return small || coarse || cores <= 4 || mem <= 4 ? 'low' : 'high'
}

interface AppState {
  /** 0 to 1 progress through the forest journey (the tall hero section) */
  journey: number
  /** true once the 3D canvas exists and the preloader can leave */
  ready: boolean
  /** false when the journey is finished, so the canvas can stop rendering */
  sceneActive: boolean
  tier: Tier
}

export const useAppStore = create<AppState>(() => ({
  journey: 0,
  ready: false,
  sceneActive: true,
  tier: detectTier(),
}))
