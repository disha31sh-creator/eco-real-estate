import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import Atmosphere from './Atmosphere'
import CameraRig from './CameraRig'
import Effects from './Effects'
import Forest from './Forest'
import House from './House'
import Lighting from './Lighting'
import Terrain from './Terrain'

// The one big fixed canvas behind the whole hero journey.
export default function Experience() {
  const tier = useAppStore((s) => s.tier)
  const active = useAppStore((s) => s.sceneActive)
  const high = tier === 'high'

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        shadows="percentage"
        dpr={high ? [1, 1.75] : 1}
        frameloop={active ? 'always' : 'never'}
        camera={{ fov: 62, near: 0.1, far: 260, position: [-5, 1.7, 58] }}
        gl={{ antialias: !high, powerPreference: 'high-performance' }}
        onCreated={() => {
          // short pause so the first frames can compile before the preloader lifts
          setTimeout(() => useAppStore.setState({ ready: true }), 900)
        }}
      >
        <Suspense fallback={null}>
          <Atmosphere />
          <Lighting />
          <Terrain />
          <Forest />
          <House />
          <CameraRig />
          {high && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  )
}
