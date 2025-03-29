"use client";

import React from "react";
import { motion } from "framer-motion";

import useGyroCompass from "@/customhooks/useGyroCompass";

const test = () => {
  const { permissionGranted, requestPermission, rotation } = useGyroCompass();
  return (
    <div className="justify-center items-center">
      {!permissionGranted && (
        <motion.button
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          onClick={requestPermission}
          className="px-4 py-2 flex items-center justify-center text-center bg-blue-100 text-gray-600 rounded-2xl text-xl"
          style={{
            fontFamily: "NicoMoji",
            boxShadow: "0 6px 3px #6495ed",
            border: "none",
          }}
        >
          センサーの許可
        </motion.button>
      )}
      {rotation}
    </div>
  );
};

export default test;
