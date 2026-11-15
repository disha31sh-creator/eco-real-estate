import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  IcosahedronGeometry,
  InstancedMesh,
  Object3D,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useAppStore, type Tier } from '../../store/useAppStore'
import { clearingValue, distToPath, heightAt, mulberry32 } from '../../utils/terrain'

/** Give a shape a vertical colour gradient (baked into the vertices, so no textures are needed). */
function paint(source: BufferGeometry, bottom: string, top: string) {
  const g = source.index ? source.toNonIndexed() : source
  const pos = g.attributes.position
  let lo = Infinity
  let hi = -Infinity
  for (let i = 0; i < pos.count; i++) {
    lo = Math.min(lo, pos.getY(i))
    hi = Math.max(hi, pos.getY(i))
  }
  const c1 = new Color(bottom)
  const c2 = new Color(top)
  const c = new Color()
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    c.lerpColors(c1, c2, (pos.getY(i) - lo) / (hi - lo || 1))
    colors.set([c.r, c.g, c.b], i * 3)
  }
  g.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return g
}

function buildPine() {
  const parts: BufferGeometry[] = []
  const trunk = new CylinderGeometry(0.16, 0.26, 2, 6)
  trunk.translate(0, 1, 0)
  parts.push(paint(trunk, '#3e2c20', '#5a4130'))
  // [radius, height, base y]
  const tiers = [
    [2.1, 3.2, 2.2],
    [1.7, 3.0, 3.9],
    [1.3, 2.7, 5.5],
    [0.85, 2.3, 7.0],
  ]
  for (const [r, h, y] of tiers) {
    const cone = new ConeGeometry(r, h, 8)
    cone.translate(0, y + h / 2, 0)
    parts.push(paint(cone, '#1b4224', '#376f36'))
  }
  return mergeGeometries(parts)!
}

function buildBroadleaf() {
  const parts: BufferGeometry[] = []
  const trunk = new CylinderGeometry(0.22, 0.34, 3, 6)
  trunk.translate(0, 1.5, 0)
  parts.push(paint(trunk, '#3e2c20', '#5a4130'))
  const blobs = [
    [0, 4.6, 0, 2.4],
    [1.3, 3.8, 0.5, 1.7],
    [-1.2, 4.0, -0.6, 1.8],
    [0.2, 5.9, 0.2, 1.5],
  ]
  for (const [x, y, z, r] of blobs) {
    const blob = new IcosahedronGeometry(r, 1)
    blob.translate(x, y, z)
    parts.push(paint(blob, '#2f6b2f', '#68a23f'))
  }
  return mergeGeometries(parts)!
}

function buildBush() {
  return paint(new IcosahedronGeometry(1, 1), '#2a5a2b', '#639a40')
}

let pineCache: BufferGeometry | null = null
/** Shared with the small 3D property cards. */
export function getPineGeometry() {
  return (pineCache ??= buildPine())
}

interface Item {
  x: number
  y: number
  z: number
  rot: number
  sx: number
  sy: number
  sz: number
  tint: [number, number, number]
}

function generate(tier: Tier) {
  const trees = tier === 'high' ? 1100 : 450
  const bushCount = tier === 'high' ? 420 : 160
  const rand = mulberry32(7)
  const pines: Item[] = []
  const broad: Item[] = []
  const bushes: Item[] = []

  let guard = 0
  while (pines.length + broad.length < trees && guard++ < 30000) {
    const x = (rand() - 0.5) * 160
    const z = -75 + rand() * 165
    if (clearingValue(x, z) < 1) continue // keep the clearing around the house open
    if (distToPath(x, z) < 5.2) continue // keep the camera path open
    const s = 0.85 + rand() * 0.9
    const b = 0.8 + rand() * 0.35
    const item: Item = {
      x,
      y: heightAt(x, z) - 0.1,
      z,
      rot: rand() * Math.PI * 2,
      sx: s * (0.9 + rand() * 0.2),
      sy: s,
      sz: s * (0.9 + rand() * 0.2),
      tint: [b, b, b * (0.9 + rand() * 0.2)],
    }
    ;(rand() < 0.72 ? pines : broad).push(item)
  }

  guard = 0
  while (bushes.length < bushCount && guard++ < 20000) {
    const x = (rand() - 0.5) * 124
    const z = -40 + rand() * 115
    if (distToPath(x, z) < 2.2) continue
    if (Math.abs(x) < 15 && z > -10 && z < 7) continue // not through the house
    const s = 0.5 + rand() * 0.9
    const b = 0.75 + rand() * 0.4
    bushes.push({
      x,
      y: heightAt(x, z) + 0.25 * s,
      z,
      rot: rand() * Math.PI * 2,
      sx: s * 1.2,
      sy: s * 0.75,
      sz: s * 1.2,
      tint: [b, b, b],
    })
  }
  return { pines, broad, bushes }
}

function InstancedSet({ geometry, items }: { geometry: BufferGeometry; items: Item[] }) {
  const ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const o = new Object3D()
    const c = new Color()
    items.forEach((it, i) => {
      o.position.set(it.x, it.y, it.z)
      o.rotation.set(0, it.rot, 0)
      o.scale.set(it.sx, it.sy, it.sz)
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
      c.setRGB(it.tint[0], it.tint[1], it.tint[2])
      mesh.setColorAt(i, c)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [items])

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, items.length]}
      castShadow
      receiveShadow
      frustumCulled={false}
    >
      <meshStandardMaterial vertexColors roughness={0.95} />
    </instancedMesh>
  )
}

export default function Forest() {
  const tier = useAppStore((s) => s.tier)
  const data = useMemo(() => generate(tier), [tier])
  const pine = useMemo(() => getPineGeometry(), [])
  const broad = useMemo(() => buildBroadleaf(), [])
  const bush = useMemo(() => buildBush(), [])

  return (
    <group>
      <InstancedSet geometry={pine} items={data.pines} />
      <InstancedSet geometry={broad} items={data.broad} />
      <InstancedSet geometry={bush} items={data.bushes} />
    </group>
  )
}
