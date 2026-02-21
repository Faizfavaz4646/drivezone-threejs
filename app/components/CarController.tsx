import { useGLTF } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'


interface Props {
  isNight: boolean
}

export function CarController({isNight}:Props) {
  const [followCar, setFollowCar] = useState(true)
  const carRef = useRef<THREE.Group>(null)
  const leftTarget = useRef<THREE.Object3D>(new THREE.Object3D())
  const rightTarget = useRef<THREE.Object3D>(new THREE.Object3D())
  const { scene } = useGLTF('/models/car1.glb')
  const {camera}=useThree()

  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys((k) => ({ ...k, forward: true }))
          break
        case 's':
        case 'arrowdown':
          setKeys((k) => ({ ...k, backward: true }))
          break
        case 'a':
        case 'arrowleft':
          setKeys((k) => ({ ...k, left: true }))
          break
        case 'd':
        case 'arrowright':
          setKeys((k) => ({ ...k, right: true }))
          break
        case 'c': setFollowCar(prev => !prev); break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys((k) => ({ ...k, forward: false }))
          break
        case 's':
        case 'arrowdown':
          setKeys((k) => ({ ...k, backward: false }))
          break
        case 'a':
        case 'arrowleft':
          setKeys((k) => ({ ...k, left: false }))
          break
        case 'd':
        case 'arrowright':
          setKeys((k) => ({ ...k, right: false }))
          break
          case 'c': setFollowCar(prev => prev); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

 useFrame((_, delta) => {
  if (!carRef.current) return

  const speed = 300
  const turnSpeed = 1.5

  // Move the car
  if (keys.forward) carRef.current.translateZ(-speed * delta)
  if (keys.backward) carRef.current.translateZ(speed * delta)
  if (keys.left) carRef.current.rotation.y += turnSpeed * delta
  if (keys.right) carRef.current.rotation.y -= turnSpeed * delta

  // Update spotlight targets
  const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(carRef.current.quaternion)
  const pos = carRef.current.position.clone()

  leftTarget.current.position.copy(
    pos.clone().add(dir.clone().multiplyScalar(15)).add(new THREE.Vector3(-1.5, 2.6, 0))
  )
  rightTarget.current.position.copy(
    pos.clone().add(dir.clone().multiplyScalar(15)).add(new THREE.Vector3(1.5, 2.6, 0))
  )

  //  Camera follow
  if(followCar && carRef.current){
  const cameraOffset = new THREE.Vector3(0, 200, 300).applyQuaternion(carRef.current.quaternion)
  const cameraTarget = pos.clone().add(cameraOffset)
  camera.position.lerp(cameraTarget, 0.3) // Smooth follow
  camera.lookAt(pos)
  }
})


  return (
    <>
      <group ref={carRef} scale={0.5} position={[50, 5, 100]}>
        <primitive object={scene} />

        {/* Left Headlight Bulb */}
        <mesh position={[-30, 40, -147]}  castShadow>
          <sphereGeometry args={[6, 32, 32]} />
          <meshStandardMaterial emissive="white" emissiveIntensity={isNight ? 5 : 0} />
        </mesh>

        {/* Left Spotlight */}
        <spotLight
          position={[-30, 40, -178]}
          angle={6}
          penumbra={0.5}
          distance={80}
          intensity={isNight ? 9000 : 0}
          castShadow
          target={leftTarget.current}
        />

        {/*  Right Headlight Bulb */}
        <mesh position={[30, 40,-148]}>
          <sphereGeometry args={[6, 32, 32]} />
          <meshStandardMaterial emissive="white" emissiveIntensity={isNight ? 5 : 0} />
        </mesh>

        {/* Right Spotlight */}
        <spotLight
          position={[35, 40,-170]}
          angle={5}
          penumbra={0.5}
          distance={80}
          intensity={isNight ? 9000 : 0}
          castShadow
          target={rightTarget.current}
        />
      </group>

      {/* Targets to aim spotlights */}
      <primitive object={leftTarget.current} />
      <primitive object={rightTarget.current} />
    </>
  )
}
