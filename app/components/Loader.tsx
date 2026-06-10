import { useProgress, Html } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center select-none w-screen max-w-md md:max-w-xl px-6">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400 tracking-tight leading-none mb-3">
          DriveZone.3D
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-mono text-white/80 animate-pulse">
          Loading... {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}