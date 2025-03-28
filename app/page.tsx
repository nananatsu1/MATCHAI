"use client";
import JoinRoomForm from "@/components/forms/JoinRoomForm";
import AddRoomForm from "@/components/forms/AddRoomForm";
import DataInitialize from "@/components/function/DataInitialize";
import ComfirmLocalStorage from "@/components/function/ComfirmLocalStorage";
import { useEffect, useState } from "react";
import RotatingSquares from "@/components/animation/loading";
import { motion } from "framer-motion";
import UserModal from "@/components/elements/home/UserProfile";
import Info from "@/components/elements/home/Info";
import Pwa from "@/components/elements/home/Pwa";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2つの条件を満たすまで、loading状態を維持する
    // 1. フォントがロードされたかどうか
    // 2. 1秒以上経過したかどうか
    let fontsReady = false;
    let timeoutDone = false;

    const checkDone = () => {
      // 2つの条件が両方満たされていれば、loading状態を解除
      if (fontsReady && timeoutDone) {
        setLoading(false);
      }
    };

    // フォントがロードされたら、checkDoneを実行
    document.fonts.ready.then(() => {
      fontsReady = true;
      checkDone();
    });

    // 1秒以上経過したら、checkDoneを実行
    const timer = setTimeout(() => {
      timeoutDone = true;
      checkDone();
    }, 1000);

    // タイマーをクリア
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <DataInitialize />
      <ComfirmLocalStorage />
      <div
        className="w-full h-screen flex flex-col justify-center items-center relative"
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
            {/* ユーザーアイコン */}
            <UserModal />

            {/* 情報アイコン */}
            <Info />

            <h3
              className="text-gray-600 text-4xl mb-12 font-nico"
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
            <Pwa />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
