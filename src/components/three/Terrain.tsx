import { useMemo } from 'react'
import { Color, Float32BufferAttribute, MathUtils, PlaneGeometry } from 'three'
import { clearingValue, distToTrail, heightAt } from '../../utils/terrain'

export default function Terrain() {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(240, 240, 120, 120)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    const colors = new Float32Array(pos.count * 3)

    const grassA = new Color('#4d7a35')
    const grassB = new Color('#80a64b')
    const lawn = new Color('#6f9b3f')
    const moss = new Color('#2c552c')
    const dirt = new Color('#9b8660')
    const c = new Color()

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      pos.setY(i, heightAt(x, z))

      const n = 0.5 + 0.5 * Math.sin(x * 0.23 + Math.cos(z * 0.17) * 2) * Math.cos(z * 0.19 + x * 0.05)
      c.lerpColors(grassA, grassB, n)

      const inside = MathUtils.smoothstep(1.35 - clearingValue(x, z), 0, 1) // 1 inside the clearing
      c.lerp(lawn, inside * 0.6)
      c.lerp(moss, (1 - inside) * 0.55) // darker forest floor

      const trail = 1 - MathUtils.smoothstep(distToTrail(x, z), 0.8, 2.4)
      c.lerp(dirt, trail * 0.85)

      colors.set([c.r, c.g, c.b], i * 3)
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  )
}
