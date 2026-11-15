import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight, HemisphereLight, MathUtils } from 'three'
import { useAppStore } from '../../store/useAppStore'
import { rig } from '../../utils/shared'

// Golden-hour sun that follows the camera, so shadows are sharp wherever we are looking.
export default function Lighting() {
  const tier = useAppStore((s) => s.tier)
  const hemi = useRef<HemisphereLight>(null)

  const sun = useMemo(() => {
    const l = new DirectionalLight('#ffcf8f', 2)
    l.castShadow = true
    const size = tier === 'high' ? 2048 : 1024
    l.shadow.mapSize.set(size, size)
    const c = l.shadow.camera
    c.left = -34
    c.right = 34
    c.top = 34
    c.bottom = -34
    c.near = 1
    c.far = 120
    c.updateProjectionMatrix()
    l.shadow.bias = -0.0004
    l.shadow.normalBias = 0.05
    return l
  }, [tier])

  useFrame(() => {
    const f = rig.focus
    sun.target.position.copy(f)
    sun.position.set(f.x - 30, f.y + 20, f.z + 22)
    sun.target.updateMatrixWorld()
    // the light warms and strengthens as we move toward the house
    const k = MathUtils.smoothstep(rig.t, 0, 0.5)
    sun.intensity = MathUtils.lerp(1.3, 3.4, k)
    if (hemi.current) hemi.current.intensity = MathUtils.lerp(0.5, 0.75, k)
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#ffe5b8', '#35602f', 0.6]} />
      <primitive object={sun} />
      <primitive object={sun.target} />
      {/* cool rim light from behind for depth */}
      <directionalLight position={[25, 12, -35]} intensity={0.8} color="#a8c4ff" />
    </>
  )
}
