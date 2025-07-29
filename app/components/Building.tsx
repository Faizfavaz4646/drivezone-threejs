'use client'

import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Mesh } from 'three'

type BuildingProps = {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export default function Building({
  path,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [5, 10, 5],
}: BuildingProps) {
  const meshRef = useRef<Mesh>(null)
  const { scene } = useGLTF(path) 

  return (
    <primitive
      ref={meshRef}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

//  Preload the GLTF outside the component
useGLTF.preload('/build1.glb')
useGLTF.preload('/building.glb')
