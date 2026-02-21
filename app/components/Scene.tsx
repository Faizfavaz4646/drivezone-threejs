'use client'
import * as THREE from "three"
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import Building from '@/app/components/Building'
import Tree from '@/app/components/Tree'
import StreetLight from '@/app/components/Streetlight'
import { CarController } from '@/app/components/CarController'
import { Flight } from './Flight'
import RoadSett from './Road'
import { TransparentRoad } from "./ TransparentRoad"


interface SceneProps {
  isNight: boolean
}

export default function Scene({ isNight }: SceneProps) {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = null
  }, [scene])

  return (
    <>
      {/* DAY MODE  */}
      {!isNight && (
        <>
          {/* Skybox  */}
          <Sky sunPosition={[100, 50, -100]} turbidity={8}  distance={100000}  />

          {/* Sun Sphere */}
          <mesh position={[500, 800, -900]}>
            <sphereGeometry args={[19, 32, 32]} />
            <meshStandardMaterial
              color="orange"
              emissive="orange"
              emissiveIntensity={2}
            />
          </mesh>

          {/* Directional light like sunlight */}
          <directionalLight
  position={[5, 8, 30]}
  intensity={5}
  color="white"
  castShadow
  shadow-mapSize-width={2048} // Higher quality shadow
  shadow-mapSize-height={2048}
  shadow-camera-near={1}
  shadow-camera-far={100}
  shadow-camera-left={-50}
  shadow-camera-right={50}
  shadow-camera-top={50}
  shadow-camera-bottom={-50}
/>


          {/* Base ambient light for minimal fill */}
          <ambientLight intensity={0.8} />
        </>
      )}

      {/* NIGHT MODE  */}
      {isNight && (
        <>
          {/* Star background  night */}
          <Stars
            radius={600}
            depth={60}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          {/* Background night color */}
          <color attach="background" args={['#0b0c1a']} />

          {/* Moon Sphere  */}
          <mesh position={[500, 800, -900]}>
            <sphereGeometry args={[19, 32, 32]} />
            <meshStandardMaterial
              color="white"
              emissive="#cceeff"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Moonlight simulation */}
          <directionalLight
            position={[500, 100, 200]}
            intensity={8}
            color="#cceeff"
            castShadow
          />

          {/* Ambient night light */}
          <ambientLight intensity={0.9} color="#aabbee" />
        </>
      )}

      {/* Ground Plane - doesn't move */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10000, 10000]} />
          <shadowMaterial opacity={0.4} />
        <meshStandardMaterial color={isNight ? '#1e1e1e' : 'gray'} />
      </mesh>

      {/*  Buildings - static positions */}
      <Building
        path="/models/build1.glb"
        position={[-250, 0, -390]}
        scale={[100, 70, 80]}
        rotation={[0, 6.3, 0]}
      />
      <Building
        path="/models/building.glb"
        position={[60, 0, -390]}
        scale={[30, 30, 10]}
      />
      <Building
        path="/models/build4.glb"
        position={[780, 0, 2]}
        scale={[80, 50, 10]}
         rotation={[0, -1.6,0]}
      />

      {/* Tree  */}
      <Tree position={[-350, 10, -100]} />

      {/*  Streetlights during night */}
      <StreetLight position={[0, 0, 10]} lightOn={isNight} />
      <StreetLight position={[1, 0, -30]} lightOn={isNight} />
      <StreetLight position={[-36, 0, -8]} lightOn={isNight} />
      <StreetLight position={[695, 0, -8]} lightOn={isNight} />
     

c
      <CarController isNight={isNight}  />
      <Flight />
      <RoadSett position={[400,8,500]} scale={[1,0.5,0.5]} rotation={[0,1.5,0]}  />

      <TransparentRoad  />
      <OrbitControls />
    </>
  )
}
