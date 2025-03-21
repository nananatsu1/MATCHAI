"use client";

import { useState, useEffect } from "react";
import useGeolocation from "./useGeolocation";
import { getHostLocation, getMyLocation, updateLocation } from "@/utils/supabaseFunction";

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
const getAngle = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360; // 方角（度）
};

const useCalclation = () => {
    const { latitude, longitude, altitude, error } = useGeolocation(); 
    const [myLatitude, setMyLatitude] = useState<number | null>(null);
    const [myLongitude, setMyLongitude] = useState<number | null>(null);
    const [hostLatitude, setHostLatitude] = useState<number | null>(null);
    const [hostLongitude, setHostLongitude] = useState<number | null>(null);
    
    useEffect(() => {
      // 自分の位置情報が更新された時にデータベースから最新の位置情報を取得
      const getLatestLocation = async () => {
        const myLatestLocation = await getMyLocation(); // データベースから位置情報を取得する関数
        if (myLatestLocation && myLatestLocation.data) {
          setMyLatitude(myLatestLocation.data.latitude);
          setMyLongitude(myLatestLocation.data.longitude);
        }

        const hostLatestLocation = await getHostLocation(); // データベースから位置情報を取得する関数
        if (hostLatestLocation && hostLatestLocation.data) {
          setHostLatitude(hostLatestLocation.data.latitude);
          setHostLongitude(hostLatestLocation.data.longitude);
        }
      };

      getLatestLocation();
    }, [latitude, longitude]);

    //最新の位置情報をDBに保存
    useEffect(() => {
      if (latitude !== null && longitude !== null && altitude !== null) {
          updateLocation(latitude, longitude, altitude);
      }
    }, [latitude, longitude, altitude]);

    const distance = myLatitude && myLongitude && hostLatitude !== null && hostLongitude !== null
    ? getDistance(myLatitude, myLongitude, hostLatitude, hostLongitude)
    : 0;

    const angle = myLatitude && myLongitude && hostLatitude !== null && hostLongitude !== null
    ? getAngle(myLatitude, myLongitude, hostLatitude, hostLongitude)
    : 0;
    return { distance, angle };
};

export default useCalclation;
