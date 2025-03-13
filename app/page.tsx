'use client'
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

const ErrorText = () => <p className="text-red-500 text-lg">geolocation IS NOT available</p>;

export default function GeolocationPage() {
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [watchStatus, setWatchStatus] = useState<{ isWatching: boolean; watchId: number | null }>({ isWatching: false, watchId: null });

  const isFirstRef = useRef(true);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      isFirstRef.current = false;
      setAvailable(true);
    }
  }, []);

  const startWatchPosition = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
  
      const watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setPosition({ latitude, longitude });
        },
        error => {
          console.error("Error watching position:", error);
        },
        options
      );
  
      setWatchStatus({ isWatching: true, watchId });
    }
  };

  const stopWatchPosition = () => {
    if (watchStatus.watchId !== null) {
      navigator.geolocation.clearWatch(watchStatus.watchId);
    }
    setWatchStatus({ isWatching: false, watchId: null });
  };

  if (isFirstRef.current) return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Head>
        <title>Geolocation API Sample</title>
      </Head>

      <header>
        <ul className="flex gap-4 mt-4">
          <li>
            <Link legacyBehavior href="/">
              <a className="text-gray-700 hover:underline">Home</a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/arrow">
              <a className="text-gray-700 hover:underline">Arrow</a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/direction">
              <a className="text-gray-700 hover:underline">Direction</a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/room">
              <a className="text-gray-700 hover:underline">Room</a>
            </Link>
          </li>
        </ul>
      </header>

      <h2 className="text-2xl font-bold text-black mb-4">Geolocation API サンプル</h2>
      {!isAvailable && <ErrorText />}
      {isAvailable && (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col gap-4">

            {watchStatus.isWatching ? (
              <button onClick={stopWatchPosition} className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition">
                Stop Watch Position
              </button>
            ) : (
              <button onClick={startWatchPosition} className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition">
                Start Watch Position
              </button>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-black">位置</h3>
            <div className="text-gray-700">
              緯度: {position.latitude}
              <br />
              経度: {position.longitude}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
