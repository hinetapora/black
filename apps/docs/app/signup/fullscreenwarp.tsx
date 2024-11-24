"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene";
import { useState, useEffect } from "react";

const FullscreenWarp = ({ onWarpComplete }: { onWarpComplete?: () => void }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center">
      <Canvas camera={{ fov: 100, near: 0.1, far: 200 }}>
        <Scene onWarpEnd={onWarpComplete} />
      </Canvas>
      <div className="absolute text-white text-2xl font-bold">
        Building{dots}
      </div>
    </div>
  );
};

export default FullscreenWarp;
