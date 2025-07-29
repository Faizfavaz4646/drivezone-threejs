'use client'

import { Canvas } from '@react-three/fiber'
import Scene from '@/app/components/Scene'
import { OrbitControls, useProgress } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import Loader from '@/app/components/Loader'



export default function Page() {
  const controlsRef = useRef<any>(null);
  const [hover,setHover]=useState(false)
  const [isNight, setIsNight] = useState(false)
  const {progress}= useProgress()
  const isLoaded =progress>=100

  return (

    <>
    <mesh
    onPointerOver={()=>setHover(true)}
    onPointerOut={()=>setHover(false)}
    >
      </mesh> 
    {isLoaded &&( 
      <button
       className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-md cursor-pointer transition-transform duration-300 
      ${hover ? 'bg-amber-300 text-black scale-105' : 'bg-black text-white'}`}      onClick={() => setIsNight(!isNight)}
      >
        Toggle {isNight ? 'Day' : 'Night'} Mode
      </button>
      )}
  
      <Canvas shadows camera={{ position: [0, 10, 200], fov: 75, near: 0.1, far: 2000 }}>
         <Suspense fallback={<Loader />}>
       
      
  <OrbitControls
  ref={controlsRef}
  makeDefault
  enableDamping
  dampingFactor={0.05}
  enableZoom={true}
  enableRotate={true}
  target={[0, 0, 0]} // Initial target
/>
  

        <Scene isNight={isNight} />
        </Suspense>
      </Canvas>
        
    </>
  )
}
