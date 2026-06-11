'use client'

import { Canvas } from '@react-three/fiber'
import Scene from '@/app/components/Scene'
import { OrbitControls, useProgress } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'
import Loader from '@/app/components/Loader'

export default function Page() {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const [hover, setHover] = useState(false)
  const [isNight, setIsNight] = useState(false)
  const { progress } = useProgress()
  const [isLoaded, setIsLoaded] = useState(false)

  // Mark as loaded when progress is 100
  useEffect(() => {
    if (progress >= 100) {
      setIsLoaded(true)
    }
  }, [progress])

  // Fallback timer to guarantee loader dismisses on Safari/iOS even if progress hook gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  const [followCar, setFollowCar] = useState(true)

  // Listen for follow-car status changes from the 3D canvas
  useEffect(() => {
    const handleFollowCarChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ followCar: boolean }>;
      if (customEvent && customEvent.detail) {
        setFollowCar(customEvent.detail.followCar);
      }
    };
    window.addEventListener('follow-car-changed', handleFollowCarChanged);
    return () => {
      window.removeEventListener('follow-car-changed', handleFollowCarChanged);
    };
  }, []);

  const toggleFollowCar = () => {
    window.dispatchEvent(new CustomEvent('toggle-follow-car'));
  };

  const handleTouchControl = (action: 'forward' | 'backward' | 'left' | 'right', value: boolean) => {
    window.dispatchEvent(new CustomEvent('car-control', { detail: { action, value } }));
  };

  return (
    <>
      {/* Custom Styles for pulsing glow effects and animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-green {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            border-color: rgba(34, 197, 94, 1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.3);
            border-color: rgba(34, 197, 94, 0.6);
          }
        }
        @keyframes pulse-amber {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
            border-color: rgba(245, 158, 11, 1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(245, 158, 11, 0.3);
            border-color: rgba(245, 158, 11, 0.6);
          }
        }
        .pulse-active {
          animation: pulse-green 2s infinite;
        }
        .pulse-inactive {
          animation: pulse-amber 2s infinite;
        }
        .control-btn {
          -webkit-tap-highlight-color: transparent;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }
      `}} />

      <mesh
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      />

      {isLoaded && (
        <>
          {/* Day/Night Mode Toggle */}
          <button
            className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-md cursor-pointer transition-transform duration-300 shadow-md font-medium text-sm
            ${hover ? 'bg-amber-300 text-black scale-105' : 'bg-black/80 text-white border border-white/10 backdrop-blur-md'}`}
            onClick={() => setIsNight(!isNight)}
          >
            Toggle {isNight ? 'Day' : 'Night'} Mode
          </button>

          {/* Blinking "C" Toggler (Follow / Detach Car Control) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 group">
            {/* Tooltip */}
            <div className="hidden md:block opacity-0 group-hover:opacity-100 pointer-events-none translate-x-2 group-hover:translate-x-0 transition-all duration-300 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 shadow-lg whitespace-nowrap">
              {followCar ? 'Exit car control (C)' : 'Enter car control (C)'}
            </div>
            
            <button
              onClick={toggleFollowCar}
              className={`control-btn w-12 h-12 rounded-full cursor-pointer flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 backdrop-blur-md shadow-lg select-none
              ${followCar 
                ? 'bg-green-950/80 text-green-400 border-green-500 pulse-active hover:bg-green-900/90' 
                : 'bg-amber-950/80 text-amber-400 border-amber-500 pulse-inactive hover:bg-amber-900/90'
              }`}
            >
              C
            </button>
          </div>

          {/* Mobile Gamepad Controls (Visible on screens < 768px) */}
          <div className="md:hidden absolute inset-x-0 bottom-0 z-20 pointer-events-none flex flex-col justify-end p-6 select-none">
            <div className="flex justify-between items-end w-full">
              {/* Steering Controls (Left / Right) */}
              <div className="flex gap-4 pointer-events-auto">
                <button
                  onTouchStart={(e) => { e.preventDefault(); handleTouchControl('left', true); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('left', false); }}
                  onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('left', false); }}
                  onMouseDown={() => handleTouchControl('left', true)}
                  onMouseUp={() => handleTouchControl('left', false)}
                  onMouseLeave={() => handleTouchControl('left', false)}
                  className="control-btn w-16 h-16 rounded-2xl bg-black/60 border border-white/20 text-white flex items-center justify-center shadow-lg backdrop-blur-md active:bg-white/20 transition-all duration-150 cursor-pointer"
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <button
                  onTouchStart={(e) => { e.preventDefault(); handleTouchControl('right', true); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('right', false); }}
                  onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('right', false); }}
                  onMouseDown={() => handleTouchControl('right', true)}
                  onMouseUp={() => handleTouchControl('right', false)}
                  onMouseLeave={() => handleTouchControl('right', false)}
                  className="control-btn w-16 h-16 rounded-2xl bg-black/60 border border-white/20 text-white flex items-center justify-center shadow-lg backdrop-blur-md active:bg-white/20 transition-all duration-150 cursor-pointer"
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </div>

              {/* Throttle & Brake Controls (Forward / Backward) */}
              <div className="flex flex-col gap-4 pointer-events-auto items-center">
                <button
                  onTouchStart={(e) => { e.preventDefault(); handleTouchControl('forward', true); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('forward', false); }}
                  onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('forward', false); }}
                  onMouseDown={() => handleTouchControl('forward', true)}
                  onMouseUp={() => handleTouchControl('forward', false)}
                  onMouseLeave={() => handleTouchControl('forward', false)}
                  className="control-btn w-16 h-16 rounded-2xl bg-black/60 border border-white/20 text-white flex items-center justify-center shadow-lg backdrop-blur-md active:bg-white/20 transition-all duration-150 cursor-pointer"
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                  </svg>
                </button>
                <button
                  onTouchStart={(e) => { e.preventDefault(); handleTouchControl('backward', true); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('backward', false); }}
                  onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('backward', false); }}
                  onMouseDown={() => handleTouchControl('backward', true)}
                  onMouseUp={() => handleTouchControl('backward', false)}
                  onMouseLeave={() => handleTouchControl('backward', false)}
                  className="control-btn w-16 h-16 rounded-2xl bg-black/60 border border-white/20 text-white flex items-center justify-center shadow-lg backdrop-blur-md active:bg-white/20 transition-all duration-150 cursor-pointer"
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 16l6-6-1.41-1.41L12 13.17 7.41 8.59 6 10z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
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
            target={[0, 0, 0]}
          />
          <Scene isNight={isNight} />
        </Suspense>
      </Canvas>
    </>
  )
}
