"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

const destination = { latitude: 35.681236, longitude: 139.767125 }; // 例: 東京駅

const toRadians = (degrees: number) => degrees * (Math.PI / 180);
const toDegrees = (radians: number) => radians * (180 / Math.PI);

// 2点間の距離を計算（Haversineの公式）
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // 地球の半径（メートル）
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 距離（メートル）
};

// 目的地の方角を計算
const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360; // 方角（度）
};

export default function GeolocationWithDirection() {
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [distance, setDistance] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [deviceRotation, setDeviceRotation] = useState<number>(0);
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
        pos => {
          const { latitude, longitude } = pos.coords;
          setPosition({ latitude, longitude });

          if (latitude !== null && longitude !== null) {
            const d = getDistance(latitude, longitude, destination.latitude, destination.longitude);
            const b = getBearing(latitude, longitude, destination.latitude, destination.longitude);
            setDistance(d);
            setBearing(b);
          }
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

  // コンパス（デバイスの向き）を取得
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceRotation(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // 矢印の回転角度を計算（目的地方向 - デバイスの向き）
  const arrowRotation = bearing !== null ? bearing - deviceRotation : 0;

  if (isFirstRef.current) return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Head>
        <title>Geolocation API with Direction</title>
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
        </ul>
      </header>

      <h2 className="text-2xl font-bold text-black mb-4">リアルタイム位置情報と方向</h2>
      {!isAvailable && <p className="text-red-500 text-lg">Geolocation IS NOT available</p>}
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

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-black">目的地情報</h3>
            <p className="text-gray-700">距離: {distance !== null ? (distance / 1000).toFixed(2) + " km" : "測定中..."}</p>
            <p className="text-gray-700">方角: {bearing !== null ? bearing.toFixed(2) + "°" : "測定中..."}</p>

            <div className="mt-6">
              <img
                src="/arrow.png"
                alt="Arrow"
                className="w-24 h-24 transform"
                style={{ transform: `rotate(${arrowRotation}deg)` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
