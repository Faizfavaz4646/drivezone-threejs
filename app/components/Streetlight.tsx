'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StreetLightProps {
  position: [number, number, number]
  lightOn: boolean
}

export default function StreetLight({ position, lightOn }: StreetLightProps) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = lightOn ? 1.5 : 0
    }
  })

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[5, 10, 500]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Lamp Head */}
      <mesh position={[0, 255, 0]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshStandardMaterial emissive={lightOn ? 'yellow' : 'black'} emissiveIntensity={1} color="white" />
      </mesh>

      {/* Light Source */}
 <spotLight
          ref={lightRef}
          position={[0, 100, 0]}
          angle={Math.PI / 5} // spotlight cone angle
          penumbra={0.6}      // softness of edges
          intensity={100}
          distance={25}
          castShadow
          color="white"
          target-position={[0, 0, 0]} // Aim to ground (optional, or set below)
        />
    </group>
  )
}
