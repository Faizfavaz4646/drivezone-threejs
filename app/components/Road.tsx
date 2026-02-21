'use client'

import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

type RoadProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  animate?: boolean; // Optional: if you want to rotate it continuously
};

export default function RoadSett({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
 
}: RoadProps) {
  const roadRef = useRef<Mesh>(null);
  const { scene } = useGLTF('/models/road.glb');



  return (
    <primitive
      ref={roadRef}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
