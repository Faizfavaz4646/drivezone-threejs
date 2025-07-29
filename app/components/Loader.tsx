import { useProgress,Html } from "@react-three/drei";

export default function Loader(){
    const {progress}=useProgress()
    return(
        <Html center>
            <h1 className="text-3xl font-mono">
                <p className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
                    DriveZone.3D </p>Loading...{progress.toFixed(2)}%</h1>

        </Html>
    )

}