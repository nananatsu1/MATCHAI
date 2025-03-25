"use client";
import JoinRoomForm from "@/components/forms/JoinRoomForm";
import AddRoomForm from "@/components/forms/AddRoomForm";
import DataInitialize from "@/components/function/DataInitialize";
import ComfirmLocalStorage from "@/components/function/ComfirmLocalStorage";
import { useEffect, useState, useRef } from "react";
import RotatingSquares from "@/components/animation/loading";
import { motion } from "framer-motion";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import {
  getUserSettings,
  updateUserSettings,
  uploadUserIcon,
} from "@/utils/supabaseFunction";
import Image from "next/image";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userIcon, setUserIcon] = useState("/icons/user_default_icon.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let fontsReady = false;
    let timeoutDone = false;

    const checkDone = () => {
      if (fontsReady && timeoutDone) {
        setLoading(false);
      }
    };

    document.fonts.ready.then(() => {
      fontsReady = true;
      checkDone();
    });

    const timer = setTimeout(() => {
      timeoutDone = true;
      checkDone();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ユーザー設定を読み込む
  useEffect(() => {
    const loadUserSettings = async () => {
      const userId = localStorage.getItem("id");
      if (userId) {
        const settings = await getUserSettings(userId);
        if (settings) {
          setUserName(settings.name || "");
          setUserIcon(settings.icon || "/icons/user_default_icon.png");
        }
      }
    };
    loadUserSettings();
  }, []);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = localStorage.getItem("id");
    if (!userId) return;
    const file = e.target.files?.[0];
    console.log("");
    console.log(file);
    if (file) {
      e.target.value = ""; // 同じファイルの選択を許可する
      const newIconUrl = await uploadUserIcon(userId, file);
      if (newIconUrl) {
        setUserIcon(newIconUrl);
      }
    }
  };

  const handleSaveSettings = async () => {
    const userId = localStorage.getItem("id");
    if (userId) {
      await updateUserSettings(userId, userName, userIcon);
      setShowUserModal(false);
    }
  };

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
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => setShowUserModal(true)}
              className="absolute top-4 left-5"
            >
              <Image
                src={userIcon}
                alt="User Icon"
                width={55}
                height={55}
                className="rounded-full"
              />
            </motion.button>

            {/* 情報アイコン */}
            <motion.button
              whileTap={{ scale: 0.8, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => setShowInfoModal(true)}
              className="absolute top-5 right-5"
            >
              <IoIosInformationCircleOutline className="text-5xl text-gray-300" />
            </motion.button>
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
          </motion.div>
        )}

        {/* 説明モーダル */}
        {showInfoModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#f9f8f7] rounded-3xl p-8 w-80 shadow-lg relative"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={() => setShowInfoModal(false)}
                className="absolute top-5 right-5"
              >
                <RxCross1 className="text-gray-400 text-xl" />
              </motion.button>

              <h3
                className="text-center text-2xl mb-4 mt-5"
                style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
              >
                MATCHAIとは？
              </h3>

              <div
                className="text-gray-600 space-y-4"
                style={{ fontFamily: "NicoMoji" }}
              >
                <p className="text-lg leading-relaxed">
                  集合を簡単にしたり、
                  <br />
                  迷子になってもすぐに
                  <br />
                  合流するためのアプリ！！
                </p>
                <p className="text-lg leading-relaxed">
                  集合場所に着いた人が
                  <br />
                  ルームを作成して、4桁の
                  <br />
                  パスワードを他の人に共有！
                </p>
                <p className="text-lg leading-relaxed">
                  他の人は共有された
                  <br />
                  パスワードを入力するだけで、
                  <br />
                  ホストまでの方向と距離が
                  <br />
                  表示される！！
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* ユーザー設定モーダル */}
        {showUserModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#f9f8f7] rounded-3xl p-8 w-80 shadow-lg relative"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={() => setShowUserModal(false)}
                className="absolute top-5 right-5"
              >
                <RxCross1 className="text-gray-400 text-xl" />
              </motion.button>

              <h3
                className="text-center text-2xl mb-6 mt-5"
                style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
              >
                ユーザー設定
              </h3>

              <div className="flex flex-col items-center space-y-6">
                {/* アイコン選択 */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleIconClick}
                    className="relative"
                  >
                    <Image
                      src={userIcon}
                      alt="User Icon"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">変更</span>
                    </div>
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* ユーザー名入力 */}
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="ユーザー名"
                  className="w-full p-2 text-xl text-center bg-[#ddd] rounded-xl"
                  style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
                />

                {/* 保存ボタン */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onClick={handleSaveSettings}
                  className="w-full py-2 bg-white rounded-xl text-xl"
                  style={{
                    fontFamily: "NicoMoji",
                    color: "#7d7d7d",
                    boxShadow: "2px 6px 3px #dee6ee",
                  }}
                >
                  保存
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
