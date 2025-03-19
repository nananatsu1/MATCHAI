"use client";
import React from "react";
import Arrow from "@/components/Arrow";
import useCompass from "@/components/useGyroCompass";

const Page = () => {
  const { rotation, direction, permissionGranted, requestPermission, error } = useCompass();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* 許可ボタン */}
      {!permissionGranted && (
        <button
          onClick={requestPermission}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          センサーの許可
        </button>
      )}

      {/* コンパス情報 */}
      <div className="mt-4 text-lg font-semibold">
        {error ? `エラー: ${error}` : `方角: ${direction} (${rotation}°)`}
      </div>

      <Arrow />
    </div>
  );
};

export default Page;
