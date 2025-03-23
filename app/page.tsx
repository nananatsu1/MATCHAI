"use client";
import JoinRoomForm from "@/components/forms/JoinRoomForm";
import AddRoomForm from "@/components/forms/AddRoomForm";
import DataInitialize from "@/components/function/DataInitialize";
import ComfirmLocalStorage from "@/components/function/ComfirmLocalStorage";
import { useEffect, useState } from "react";
import RotatingSquares from "@/components/animation/loading";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fontsReady = false;
    let timeoutDone = false;
  
    const checkDone = () => {
      if (fontsReady && timeoutDone) {
        setLoading(false);
      }
    };
  
    // フォント読み込み待機
    (document as any).fonts.ready.then(() => {
      fontsReady = true;
      checkDone();
    });
  
    // 1秒の遅延
    const timer = setTimeout(() => {
      timeoutDone = true;
      checkDone();
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []); 

  return (
    <div>
      <DataInitialize />
      <ComfirmLocalStorage />
      <div
        className="w-full h-screen flex flex-col justify-center items-center"
        style={{ backgroundColor: "#f9f8f7" }}
      >
        {loading ? (
          <RotatingSquares />
        ) : (
          <div className="text-center">
            <h3
              className="text-gray-600 text-lg mb-4 font-nico"
              style={{ color: "#7d7d7d", fontFamily: "NicoMoji" }}
            >
              パスワード
            </h3>

            <JoinRoomForm />

            <div className="flex items-center gap-4 mb-4 w-84">
              <div className="flex-grow border-t border-gray-400"></div>
              <span
                className="text-gray-500 text-sm"
                style={{ fontFamily: "NicoMoji" }}
              >
                または
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            <AddRoomForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
