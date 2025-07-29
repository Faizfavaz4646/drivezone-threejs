'use client'

import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export function TransparentRoad() {
  // Load texture
  const roadTexture = useLoader(THREE.TextureLoader, '/alpha.jpg') 

  
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping
  roadTexture.repeat.set(20, 20) // You can adjust as needed

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 5, 0]} scale={[50,50,10]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        map={roadTexture}
        transparent={true}
        alphaTest={0.5} // Discards low-opacity pixels
      />
    </mesh>
  )
}
