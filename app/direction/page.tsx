'use client'

import { useState, useEffect } from "react";
import React from 'react'


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

const Direction = () => {
  const [position, setPosition] = useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });
  const [distance, setDistance] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [deviceRotation, setDeviceRotation] = useState<number>(0);

  useEffect(() => {
    // 現在地を監視
    const watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition({ latitude, longitude });

      // 目的地までの距離と方角を計算
      const d = getDistance(latitude, longitude, destination.latitude, destination.longitude);
      const b = getBearing(latitude, longitude, destination.latitude, destination.longitude);
      setDistance(d);
      setBearing(b);
    });

    // コンパスの向きを取得
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceRotation(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // 矢印の回転角度を計算（目的地方向 - デバイスの向き）
  const arrowRotation = bearing !== null ? bearing - deviceRotation : 0;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-600">目的地の方向と距離</h2>
      
      {position.latitude !== null && position.longitude !== null ? (
        <>
          <p className="text-gray-600">現在地: {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}</p>
          <p className="text-gray-600">距離: {distance !== null ? (distance / 1000).toFixed(2) + " km" : "測定中..."}</p>
          <p className="text-gray-600">方角: {bearing !== null ? bearing.toFixed(2) + "°" : "測定中..."}</p>

          <div className="mt-6">
            <img
              src="/arrow.png"
              alt="Arrow"
              className="w-24 h-24 transform"
              style={{ transform: `rotate(${arrowRotation}deg)` }}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-600">位置情報を取得中...</p>
      )}
    </div>
  );
};

export default Direction;
