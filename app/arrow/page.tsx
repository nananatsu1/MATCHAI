'use client'
import { useState, useEffect } from "react";

const Arrow = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setRotation(-event.alpha); // `event.alpha` はデバイスの北向きの角度 (0° = 北)
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <img
          src="/arrow.png"
          alt="Arrow"
          className="w-24 h-24 transform"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <p className="mt-4 text-xl">角度: {rotation.toFixed(2)}°</p>
      </div>
    </div>
  );
};

export default Arrow;
