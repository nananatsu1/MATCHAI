'use client'
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

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

  const getCurrentPosition = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setPosition({ latitude, longitude });
      });
    }
  };

  const startWatchPosition = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        setPosition({ latitude, longitude });
      });

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
      <h2 className="text-2xl font-bold mb-4">Geolocation API Sample</h2>
      {!isAvailable && <ErrorText />}
      {isAvailable && (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col gap-4">
            <button onClick={getCurrentPosition} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition">
              Get Current Position
            </button>
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
            <h3 className="text-lg font-semibold">Position</h3>
            <div className="text-gray-700">
              latitude: {position.latitude}
              <br />
              longitude: {position.longitude}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Watch Mode</h3>
            <p className="text-gray-700">Watch Status: {watchStatus.isWatching ? "Watching" : "Not Watching"}</p>
            <p className="text-gray-700">Watch ID: {watchStatus.watchId}</p>
          </div>
        </div>
      )}
    </div>
  );
}
