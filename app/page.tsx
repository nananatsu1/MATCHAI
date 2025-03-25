"use client";
import JoinRoomForm from "@/components/forms/JoinRoomForm";
import AddRoomForm from "@/components/forms/AddRoomForm";
import DataInitialize from "@/components/function/DataInitialize";
import ComfirmLocalStorage from "@/components/function/ComfirmLocalStorage";
import { useEffect, useState } from "react";
import RotatingSquares from "@/components/animation/loading";
import { motion } from "framer-motion";

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
          <motion.div
            initial={{ opacity: 1 }} // 最初は透明
            animate={{ opacity: [1, 1, 0] }} // ゆっくりフェードイン
            transition={{ duration: 2, times: [0, 0.8, 1] }} // ゆっくり表示
          >
            <RotatingSquares />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} // 最初は透明＆少し下に
            animate={{ opacity: 1 }} // ゆっくりフェードイン
            transition={{ duration: 1.3 }} // ゆっくり表示
            className="text-center"
          >
            <h3
              className="text-gray-600 text-4xl mb-8 font-nico"
              style={{ color: "#7d7d7d", fontFamily: "NicoMoji" }}
            >
              パスワード
            </h3>

            <JoinRoomForm />
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="flex-grow border-t-2 border-gray-300"></div>
              <span
                className="text-gray-600 text-xl"
                style={{ fontFamily: "NicoMoji" }}
              >
                または
              </span>
              <div className="flex-grow border-t-2 border-gray-300"></div>
            </div>
            <AddRoomForm />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
