import { CatmullRomCurve3, MathUtils, Vector3 } from 'three'

/** Small deterministic random generator, so the forest looks the same every visit. */
export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Ground height. Flat around the house, gently rolling in the forest. */
export function heightAt(x: number, z: number): number {
  const d = Math.hypot(x, z - 6)
  const flat = MathUtils.smoothstep(d, 16, 30)
  const h =
    0.45 * Math.sin(x * 0.07 + 1.3) * Math.cos(z * 0.06) +
    0.22 * Math.sin(x * 0.15 + z * 0.11) +
    0.12 * Math.sin(x * 0.4) * Math.cos(z * 0.37)
  return h * flat
}

// The camera flies along this spline (x, y, z). The house sits at the origin, facing +z.
export const CAM_POINTS: [number, number, number][] = [
  [-5, 1.6, 58],
  [3, 1.7, 44],
  [-2, 1.8, 32],
  [2, 1.7, 24],
  [0.5, 1.9, 18],
  [0, 2.1, 13],
  [9, 2.6, 16],
  [17, 3.6, 22],
]

// ...and looks at the matching point on this spline.
export const LOOK_POINTS: [number, number, number][] = [
  [0, 3, 26],
  [0, 2.8, 12],
  [0, 2.6, 0],
  [0, 2.6, 0],
  [0, 2.4, 0],
  [0, 2.4, 2],
  [-1, 2.4, 2],
  [-3, 2.6, 0],
]

export const camCurve = new CatmullRomCurve3(
  CAM_POINTS.map((p) => new Vector3(...p)),
  false,
  'centripetal',
)
export const lookCurve = new CatmullRomCurve3(
  LOOK_POINTS.map((p) => new Vector3(...p)),
  false,
  'centripetal',
)

type XZ = [number, number][]
const pathXZ: XZ = camCurve.getPoints(260).map((p) => [p.x, p.z])
// the dirt trail only runs as far as the house (first 72% of the flight)
const trailXZ: XZ = Array.from({ length: 140 }, (_, i) => {
  const p = camCurve.getPoint((i / 139) * 0.72)
  return [p.x, p.z] as [number, number]
})

function minDist(points: XZ, x: number, z: number) {
  let m = Infinity
  for (const [px, pz] of points) {
    const d = (x - px) * (x - px) + (z - pz) * (z - pz)
    if (d < m) m = d
  }
  return Math.sqrt(m)
}

export const distToPath = (x: number, z: number) => minDist(pathXZ, x, z)
export const distToTrail = (x: number, z: number) => minDist(trailXZ, x, z)

/** Less than 1 means "inside the clearing around the house". */
export const clearingValue = (x: number, z: number) => (x / 21) ** 2 + ((z - 8) / 18) ** 2
