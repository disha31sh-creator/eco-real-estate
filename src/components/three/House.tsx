// A procedural architectural house built from simple shapes (placeholder for a real model).
// It faces +z and sits on the ground at y = 0.

interface BoxProps {
  pos: [number, number, number]
  size: [number, number, number]
  color: string
  rough?: number
  metal?: number
  emissive?: string
  glow?: number
  rot?: [number, number, number]
}

function Box({ pos, size, color, rough = 0.85, metal = 0, emissive, glow = 0, rot }: BoxProps) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={rough}
        metalness={metal}
        emissive={emissive}
        emissiveIntensity={glow}
      />
    </mesh>
  )
}

function Glow({ pos, r, intensity = 4 }: { pos: [number, number, number]; r: number; intensity?: number }) {
  return (
    <mesh position={pos}>
      <sphereGeometry args={[r, 16, 16]} />
      <meshStandardMaterial
        color="#fff0cf"
        emissive="#ffd9a0"
        emissiveIntensity={intensity}
        toneMapped={false}
      />
    </mesh>
  )
}

export interface HouseProps {
  timber?: string
  wing?: string
  roof?: string
  roofTilt?: number
  annex?: boolean
  panels?: boolean
  glow?: number
  lights?: boolean
}

const SLATS = [0, 1, 2, 3, 4, 5]
const MULLIONS = [-3.05, -1.525, 0, 1.525, 3.05]
const PANELS = [
  [-4.5, -1.6],
  [-1.5, -1.6],
  [1.5, -1.6],
  [4.5, -1.6],
  [-4.5, 1.2],
  [-1.5, 1.2],
  [1.5, 1.2],
  [4.5, 1.2],
]
const STONES = Array.from({ length: 11 }, (_, i) => 7.8 + i * 1.75)

export default function House({
  timber = '#9a6a40',
  wing = '#d9ceb6',
  roof = '#3a3632',
  roofTilt = -0.03,
  annex = true,
  panels = true,
  glow = 1.6,
  lights = true,
}: HouseProps) {
  return (
    <group>
      {/* deck + stone plinth */}
      <Box pos={[0, 0.17, 3.6]} size={[16, 0.34, 7.6]} color="#8a6240" />
      <Box pos={[0, 0.25, 0]} size={[11, 0.5, 6.4]} color="#6b6a62" rough={0.95} />

      {/* timber wings */}
      <Box pos={[-4.15, 2.3, 0]} size={[2.2, 3.6, 6]} color={timber} />
      <Box pos={[4.15, 2.3, 0]} size={[2.2, 3.6, 6]} color={timber} />
      {[-4.15, 4.15].flatMap((cx) =>
        SLATS.map((i) => (
          <Box
            key={`${cx}-${i}`}
            pos={[cx - 0.9 + i * 0.36, 2.3, 3.06]}
            size={[0.14, 3.6, 0.12]}
            color="#6e4727"
          />
        )),
      )}

      {/* glass living room */}
      <Box pos={[0, 2.3, -2.8]} size={[6.1, 3.6, 0.4]} color="#4a3a2c" />
      <Box pos={[0, 0.58, 0]} size={[6.1, 0.1, 5.6]} color="#c8a77a" />
      <Box pos={[0, 4.02, 0]} size={[6.1, 0.12, 5.8]} color="#d9b98a" />
      <Box pos={[0, 2.3, -2.55]} size={[5.6, 3, 0.05]} color="#ffcf94" emissive="#ffb35c" glow={glow} />
      <Box pos={[-1.2, 0.95, -1.6]} size={[2.6, 0.7, 1]} color="#32261d" />
      <Box pos={[0.8, 0.82, -0.2]} size={[1.2, 0.4, 0.8]} color="#6b4a30" />
      <Glow pos={[2, 2.4, -2]} r={0.18} />
      <Glow pos={[-2.2, 1.7, -0.4]} r={0.12} intensity={3} />
      <mesh position={[0, 2.3, 2.95]}>
        <planeGeometry args={[6.1, 3.5]} />
        <meshPhysicalMaterial
          color="#d7efe4"
          transparent
          opacity={0.16}
          roughness={0.05}
          metalness={0.2}
          clearcoat={1}
          depthWrite={false}
        />
      </mesh>
      {MULLIONS.map((x) => (
        <Box key={x} pos={[x, 2.3, 2.95]} size={[0.08, 3.5, 0.12]} color="#161614" metal={0.6} rough={0.4} />
      ))}
      <Box pos={[0, 1.4, 2.95]} size={[6.1, 0.08, 0.12]} color="#161614" metal={0.6} rough={0.4} />

      {/* cantilevered roof */}
      <group position={[0, 4.3, 0.7]} rotation={[roofTilt, 0, 0]}>
        <Box pos={[0, 0.15, 0]} size={[13.4, 0.38, 8.8]} color={roof} rough={0.7} metal={0.2} />
        <Box pos={[0, -0.1, 0]} size={[13, 0.08, 8.4]} color="#b98a58" />
        {panels &&
          PANELS.map(([x, z]) => (
            <Box
              key={`${x}-${z}`}
              pos={[x, 0.42, z]}
              size={[2.6, 0.07, 2.1]}
              color="#14213a"
              metal={0.85}
              rough={0.2}
              rot={[-0.1, 0, 0]}
            />
          ))}
      </group>
      <Box pos={[3.9, 4.8, -1.8]} size={[0.8, 2.2, 0.8]} color="#5d584f" rough={0.95} />

      {/* porch posts */}
      {[-5.6, -1.9, 1.9, 5.6].map((x) => (
        <mesh key={x} position={[x, 2.25, 4.7]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 3.9, 10]} />
          <meshStandardMaterial color="#2a2622" roughness={0.6} />
        </mesh>
      ))}

      {/* front door + lantern */}
      <Box pos={[4.15, 1.55, 3.1]} size={[1, 2.4, 0.1]} color="#5a3a24" />
      <Glow pos={[3.3, 2.4, 3.2]} r={0.1} intensity={5} />

      {/* green-roof annex */}
      {annex && (
        <group position={[-9.4, 0, -1]}>
          <Box pos={[0, 1.5, 0]} size={[5.6, 3, 5.2]} color={wing} rough={0.95} />
          <Box pos={[0, 1.9, 2.62]} size={[3.4, 1.5, 0.05]} color="#ffcf94" emissive="#ffb35c" glow={glow * 0.8} />
          <Box pos={[0, 3.15, 0]} size={[6, 0.1, 5.6]} color="#b98a58" />
          <Box pos={[0, 3.4, 0]} size={[6.2, 0.4, 5.8]} color="#4f8a3c" rough={1} />
        </group>
      )}

      {/* stepping-stone path */}
      {STONES.map((z, i) => (
        <Box
          key={z}
          pos={[Math.sin(z * 0.35) * 0.7 + 0.5, 0.05, z]}
          size={[1.5, 0.1, 0.9]}
          color="#8c8b82"
          rough={0.95}
          rot={[0, (i % 3) * 0.08 - 0.08, 0]}
        />
      ))}

      {lights && (
        <>
          <pointLight position={[0, 2.6, 0.6]} intensity={(glow / 1.6) * 40} distance={18} decay={2} color="#ffb35c" />
          <pointLight position={[3.3, 2.4, 3.6]} intensity={6} distance={7} decay={2} color="#ffcf94" />
        </>
      )}
    </group>
  )
}
