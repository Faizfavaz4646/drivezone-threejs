import { OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three"
 export function Flight(){
    const flightRef=useRef<THREE.Group>(null)
    const {scene}=useGLTF('/models/flight.glb')
    let angle=useRef(0)

    useFrame(() => {
  angle.current += 0.01

  const radius = 1000
  const x = radius * Math.cos(angle.current)
  const z = radius * Math.sin(angle.current)
  const y =450 + 20 * Math.sin(angle.current * 2) // Base height 

  if (flightRef.current) {
    flightRef.current.position.set(x, y, z)

    //  direction of the circular path
    const lookX = radius * Math.cos(angle.current + 0.01)
    const lookZ = radius * Math.sin(angle.current + 0.01)
    flightRef.current.lookAt(lookX, y, lookZ)
  }
})

      return <primitive ref={flightRef} object={scene} scale={10} />
}
export default function FlightScene() {
  return (
    <Canvas camera={{ position: [0, 100, 300], fov: 75 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 200, 100]} intensity={1} castShadow />
      <Sky sunPosition={[100, 100, 20]} />
      <Flight />
      <OrbitControls />
    </Canvas>
  )
}