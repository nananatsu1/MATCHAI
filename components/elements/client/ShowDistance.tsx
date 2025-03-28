"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import useCalclation from "@/customhooks/useCalclation";
import useGyroCompass from "@/customhooks/useGyroCompass";

const ShowDistance = (props: { showAltitude: boolean }) => {
  const { distance = 0, angle = 0, height = 0 } = useCalclation();
  const { rotation } = useGyroCompass();
  const [arrowRotation, setArrowRotation] = useState<number>(0);

  // 目的地の向きを計算
  useEffect(() => {
    if (angle !== null && rotation !== null) {
      setArrowRotation((angle - rotation + 360) % 360);
    }
  }, [angle, rotation]);

  // 距離を整形する関数
  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} km`; // 小数第一位まで表示
    }
    return `${Math.round(distance)} m`; // 小数点なしで表示
  };

  // 高度を整形する関数
  const formatHeight = (height: number) => {
    if (height >= 1000) {
      return `${(height / 1000).toFixed(1)} km`; // 小数第一位まで表示
    }
    return `${Math.round(height)} m`; // 小数点なしで表示
  };

  return (
    <div>
      <div className="h-[50vh] flex items-center justify-center">
        {/* 円と距離表示 */}
        <div className=" mt-10 w-[45vh] h-[45vh] relative flex items-center justify-center">
          {/* 矢印画像 */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[100%] h-[100%] relative">
                <Image
                  src="/arrow.png"
                  alt="方向を示す矢印"
                  fill
                  style={{
                    transform: `rotate(${arrowRotation}deg)`,
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          {/* 中央に距離表示 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white bg-opacity-70 rounded-full p-4">
              <p
                className="text-xl text-gray-500"
                style={{ fontFamily: "NicoMoji" }}
              >
                目的地まで
              </p>
              <p
                className="text-4xl font-semibold"
                style={{ color: "#7d7d7d" }}
              >
                {formatDistance(distance)}
              </p>
              <p
                className="text-4xl font-semibold"
                style={{ color: "#7d7d7d" }}
              >
                {angle}
              </p>
              <p
                className="text-4xl font-semibold"
                style={{ color: "#7d7d7d" }}
              >
                {rotation}
              </p>
              {props.showAltitude ? (
                <div className="mt-2">
                  <p
                    className="text-lg text-gray-500"
                    style={{ fontFamily: "NicoMoji" }}
                  >
                    高さ{" "}
                    {height > 0
                      ? `+ ${formatHeight(height)}`
                      : formatHeight(height)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDistance;
