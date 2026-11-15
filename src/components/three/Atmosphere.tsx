import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferAttribute,
  CanvasTexture,
  Color,
  DoubleSide,
  FogExp2,
  Group,
  MathUtils,
  MeshBasicMaterial,
  Points,
  SRGBColorSpace,
} from 'three'
import { useAppStore } from '../../store/useAppStore'
import { rig } from '../../utils/shared'
import { mulberry32 } from '../../utils/terrain'

const dawn = new Color('#9fb09a')
const gold = new Color('#cbd6a8')
const tmp = new Color()

function radialTexture(stops: [number, string][]) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  stops.forEach(([o, col]) => gr.addColorStop(o, col))
  g.fillStyle = gr
  g.fillRect(0, 0, 256, 256)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

function shaftTexture() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 256
  const g = c.getContext('2d')!
  const h = g.createLinearGradient(0, 0, 64, 0)
  h.addColorStop(0, 'rgba(255,226,160,0)')
  h.addColorStop(0.5, 'rgba(255,226,160,0.9)')
  h.addColorStop(1, 'rgba(255,226,160,0)')
  g.fillStyle = h
  g.fillRect(0, 0, 64, 256)
  g.globalCompositeOperation = 'destination-in'
  const v = g.createLinearGradient(0, 0, 0, 256)
  v.addColorStop(0, 'rgba(0,0,0,1)')
  v.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = v
  g.fillRect(0, 0, 64, 256)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

// Misty dawn fog that thins out as we approach the house.
function FogAndSky() {
  const fog = useRef<FogExp2>(null)
  const bg = useRef<Color>(null)
  useFrame(() => {
    const t = rig.t
    tmp.lerpColors(dawn, gold, MathUtils.smoothstep(t, 0.25, 0.7))
    if (fog.current) {
      fog.current.density = MathUtils.lerp(0.055, 0.021, MathUtils.smoothstep(t, 0, 0.5))
      fog.current.color.copy(tmp)
    }
    if (bg.current) bg.current.copy(tmp)
  })
  return (
    <>
      <fogExp2 ref={fog} attach="fog" args={['#9fb09a', 0.05]} />
      <color ref={bg} attach="background" args={['#9fb09a']} />
    </>
  )
}

function Sun() {
  const map = useMemo(
    () =>
      radialTexture([
        [0, 'rgba(255,244,210,1)'],
        [0.12, 'rgba(255,226,160,0.85)'],
        [0.4, 'rgba(255,200,120,0.25)'],
        [1, 'rgba(255,190,100,0)'],
      ]),
    [],
  )
  return (
    <sprite position={[-25, 38, -100]} scale={[70, 70, 1]}>
      <spriteMaterial
        map={map}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </sprite>
  )
}

// Soft beams of light between the trees.
const SHAFTS: [number, number][] = [
  [-22, -30],
  [-16, -18],
  [-10, -6],
  [-4, -24],
  [2, -14],
  [-28, -12],
  [-8, 8],
]

function LightShafts() {
  const map = useMemo(() => shaftTexture(), [])
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const strength = 0.4 + 0.6 * MathUtils.smoothstep(rig.t, 0.15, 0.5)
    g.children.forEach((child, i) => {
      const mat = (child as unknown as { material: MeshBasicMaterial }).material
      mat.opacity = 0.1 * strength * (0.7 + 0.3 * Math.sin(clock.elapsedTime * 0.4 + i * 1.7))
    })
  })
  return (
    <group ref={group}>
      {SHAFTS.map(([x, z], i) => (
        <mesh key={i} position={[x, 14, z]} rotation={[0, 0, -0.45]}>
          <planeGeometry args={[7, 46]} />
          <meshBasicMaterial
            map={map}
            transparent
            opacity={0.1}
            blending={AdditiveBlending}
            depthWrite={false}
            fog={false}
            toneMapped={false}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// Floating pollen / dust that travels with the camera.
function Particles() {
  const tier = useAppStore((s) => s.tier)
  const count = tier === 'high' ? 600 : 200
  const camera = useThree((s) => s.camera)
  const group = useRef<Group>(null)
  const points = useRef<Points>(null)

  const { positions, phases } = useMemo(() => {
    const r = mulberry32(21)
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (r() - 0.5) * 36
      positions[i * 3 + 1] = 0.3 + r() * 8
      positions[i * 3 + 2] = (r() - 0.5) * 44
      phases[i] = r() * Math.PI * 2
    }
    return { positions, phases }
  }, [count])

  const map = useMemo(
    () =>
      radialTexture([
        [0, 'rgba(255,255,255,1)'],
        [0.5, 'rgba(255,255,255,0.35)'],
        [1, 'rgba(255,255,255,0)'],
      ]),
    [],
  )

  useFrame(({ clock }) => {
    const g = group.current
    const p = points.current
    if (!g || !p) return
    g.position.set(camera.position.x, 0, camera.position.z - 8)
    const t = clock.elapsedTime
    const attr = p.geometry.attributes.position as BufferAttribute
    for (let i = 0; i < count; i++) {
      attr.setX(i, positions[i * 3] + Math.sin(t * 0.3 + phases[i]) * 0.6)
      attr.setY(i, positions[i * 3 + 1] + Math.sin(t * 0.5 + phases[i] * 2) * 0.4)
    }
    attr.needsUpdate = true
  })

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={map}
          size={0.14}
          color="#ffe3a3"
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={AdditiveBlending}
          fog={false}
          toneMapped={false}
        />
      </points>
    </group>
  )
}

export default function Atmosphere() {
  return (
    <>
      <FogAndSky />
      <Sun />
      <LightShafts />
      <Particles />
    </>
  )
}
