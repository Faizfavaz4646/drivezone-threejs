'use client';

import { useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Mesh } from 'three';

type TreeProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export default function Tree({
  position = [0, 0, 0],
  rotation = [0, 4, 0],
  scale = [0.1, 0.2, 0.1],
}: TreeProps) {
  const treeRef = useRef<Mesh>(null);
  const { scene } = useGLTF('/tree.glb');
  const [grassMap, grassNormal] = useTexture([
    '/grass.jpeg',
   
  ]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Grass (circular) */}
      <mesh rotation={[-Math.PI /1000, 0, 0]} receiveShadow>
        <cylinderGeometry args={[900,500]} />
        <meshStandardMaterial map={grassMap} normalMap={grassNormal} />
      </mesh>

      {/* Tree GLTF */}
      <primitive ref={treeRef} object={scene} />
    </group>
  );
}
