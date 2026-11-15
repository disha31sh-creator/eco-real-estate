import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3, type PerspectiveCamera } from 'three'
import { useAppStore } from '../../store/useAppStore'
import { rig } from '../../utils/shared'
import { camCurve, heightAt, lookCurve } from '../../utils/terrain'

// Scroll position -> camera position along the spline.
// The motion is smoothed (damped) so it glides like a camera on a rail.
export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const mouse = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const pos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])
  const dir = useMemo(() => new Vector3(), [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    rig.t = MathUtils.damp(rig.t, useAppStore.getState().journey, 3, dt)
    const t = MathUtils.clamp(rig.t, 0, 1)

    camCurve.getPoint(t, pos)
    lookCurve.getPoint(t, look)

    const m = mouse.current
    m.px = MathUtils.damp(m.px, m.x, 2.5, dt)
    m.py = MathUtils.damp(m.py, m.y, 2.5, dt)

    const breathe = Math.sin(performance.now() / 1000 * 0.6) * 0.035
    const y = pos.y + heightAt(pos.x, pos.z) + breathe
    camera.position.set(pos.x + m.px * 0.55, y + m.py * 0.25, pos.z)
    camera.lookAt(look.x + m.px * 1.2, look.y + m.py * 0.6, look.z)

    // wide and immersive at the start, tighter and more architectural at the end
    const cam = camera as PerspectiveCamera
    const fov = 62 - 26 * MathUtils.smoothstep(t, 0.08, 1)
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }

    camera.getWorldDirection(dir)
    rig.focus.copy(camera.position).addScaledVector(dir, 18)
  })

  return null
}
