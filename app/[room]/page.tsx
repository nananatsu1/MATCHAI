"use client";

import useCalclation from "@/customhooks/useCalclation";

import Arrow from "@/components/Arrow";
import {
  CheckRole,
  getAllClients,
  getRealTimeClients,
  getRoomData,
} from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useGyroCompass from "@/customhooks/useGyroCompass";
import useGeolocation from "@/customhooks/useGeolocation";
import { IoCopyOutline, IoCheckmarkOutline, IoSettingsOutline, IoLocationOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Room = () => {
  const [userrole, setUserrole] = useState<string | null>(null);
  const [clientsData, setClientsData] = useState<any>([]);
  const [roomData, setRoomData] = useState<any>([]);
  const router = useRouter();
  const { distance = 0, angle = 0 } = useCalclation();
  const [showConfigModal, setConfigModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { startWatching } = useGeolocation();
  const [is3D, setIs3D] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { rotation, permissionGranted, requestPermission } = useGyroCompass();
  const [arrowRotation, setArrowRotation] = useState<number>(0);

  // 目的地の向きを計算
  useEffect(() => {
    if (angle !== null && rotation !== null) {
      setArrowRotation((angle - rotation + 360) % 360);
    }
  }, [angle, rotation]);

  //ユーザにロールを付与
  useEffect(() => {
    const checkUserRole = async () => {
      const role = await CheckRole();
      setUserrole(role);
    };
    checkUserRole();
  }, []);

  //ユーザのロールを監視
  useEffect(() => {
    let subscription: any;

    const handleRedirect = async () => {
      if (
        (userrole !== null && userrole !== "host" && userrole !== "client") ||
        localStorage.getItem("id") == null
      ) {
        if (subscription) {
          subscription.unsubscribe(); // リダイレクト前に解除
        }
        router.push(`/`);
      }
    };

    handleRedirect();
  }, [userrole, router]);

  useEffect(() => {
    let subscription: any;

    const RoomData = async () => {
      const roomData = await getRoomData();
      setRoomData(roomData);
    };

    const initialize = async () => {
      try {
        console.log("🚀 Initializing...");
        await startWatching();

        const clientData = await getAllClients();
        if (clientData) {
          setClientsData(clientData);
        } else {
          console.warn("⚠️ No client data found");
        }

        // Supabase Realtime の監視を開始
        subscription = getRealTimeClients(() => {
          console.log("🔄 Realtime update triggered");
          const updateClients = async () => {
            const updatedClientData = await getAllClients();
            if (updatedClientData) {
              setClientsData(updatedClientData);
            }
          };
          updateClients();
        });
      } catch (error) {
        console.error("🚨 Error in initialize:", error);
      }
    };

    RoomData();
    initialize();

    return () => {
      if (subscription) {
        console.log("🛑 Unsubscribing from Realtime updates");
        subscription.unsubscribe();
      }
    };
  }, []);

  // 距離を整形する関数
  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`; // 小数第三位まで表示
    }
    return `${Math.round(distance)} m`; // 小数点なしで表示
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume; // 音量を変更 (0-1の範囲に変換)
    }
  };

  useEffect(() => {
    if (distance <= 100) {
      <audio ref={audioRef} controls>
        <source src="@/public/sounds/" type="audio/mp3" />
      </audio>;
    }
  }, [distance]);

  useEffect(() => {
    let fontsReady = false;
    let timeoutDone = false;

    document.fonts.ready.then(() => {
      fontsReady = true;
    });

    const timer = setTimeout(() => {
      timeoutDone = true;
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleExitRoom = () => {
    router.push("/");
  };

  const openConfigModal = () => {
    setConfigModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeConfigModal = () => {
    setConfigModal(false);
    document.body.style.overflow = 'auto';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomData.pass);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  if (userrole === "host") {
    // ホスト側の表示
    return (
      <div className="relative h-screen bg-white">
        <div className="h-[25vh] px-4 py-9">
          {/* ルーム名 */}
          <h2
            className="text-center text-5xl h-1/2 text-gray-600 truncate"
            style={{
              fontFamily: "NicoMoji",
            }}
          >
            {roomData.name}
          </h2>

          {/* パスワード表示 */}
          <div className="relative mt-6 text-center flex items-center justify-center space-x-4 border-3 border-gray-100 rounded-2xl pt-3 pb-3 min-w-[300px] h-[50px]">
            <div className="w-full flex items-center justify-between px-5">
              <div className="flex items-center">
                <p
                  className="text-2xl"
                  style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
                >
                  パスワード：
                </p>
                <p
                  className="text-2xl font-semibold ml-4"
                  style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
                >
                  {roomData.pass}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`px-2 py-2 rounded transition-all duration-300 ${
                  copied ? "bg-green-100 scale-110 rounded-full" : "hover:bg-gray-200"
                }`}
              >
                {copied ? (
                  <IoCheckmarkOutline size={24} color="#22c55e" className="animate-pulse" />
                ) : (
                  <IoCopyOutline size={24} color="#7d7d7d" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 参加者一覧 */}
        <div className="mt-3 ml-4 mr-4 space-y-2 overflow-y-auto h-[55vh] border-3 border-gray-100 rounded-2xl p-4">
          {clientsData.length > 0 ? (
            clientsData.map(
              (client: {
                id: number | null;
                name: string | null;
                icon: string | null;
                distance: number;
              }) => {
                // IDを基に色相を生成（0-360度）
                const hue = client.id ? ((client.id * 83) % 360 + (client.id * 157) % 180) % 360 : 0;
                return (
                  <div
                    key={client.id}
                    className="flex justify-between items-center px-6 py-3 rounded-4xl"
                    style={{
                      backgroundColor: "white",
                      fontFamily: "NicoMoji",
                      color: "#7d7d7d",
                      boxShadow: `8px 5px 4px hsla(${hue}, 80%, 80%, 0.2), 6px 3px 2px hsla(${hue}, 80%, 80%, 0.1)`,
                      border: `1px solid hsla(${hue}, 60%, 85%, 0.8)`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={client.icon || "/icons/user_default_icon.png"}
                        alt={`${client.name}のアイコン`}
                        width={45}
                        height={45}
                        className="rounded-full"
                      />
                      <span className="text-xl">{client.name}</span>
                    </div>
                    <div className="flex items-center text-xl">
                      <IoLocationOutline 
                        size={24} 
                        color={`hsla(${hue}, 70%, 60%, 1)`} 
                        className="mr-5"
                      />
                      <span className="ml-1">{formatDistance(client.distance)}</span>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div className="flex justify-center items-center h-[54vh] w-full">
              <p
                className="text-center text-xl "
                style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
              >
                参加者がまだいません
              </p>
            </div>
          )}
        </div>

        {/* 退出ボタン */}
        <div className="h-[15vh] justify-start items-center flex absolute mt-1">
          <div className="">
            <motion.button
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              onClick={handleExitRoom}
              className="ml-7 px-4 py-2 rounded-4xl bg-white"
              style={{
                color: "#7d7d7d",
                fontFamily: "NicoMoji",
                boxShadow: "2px 6px 3px #dee6ee",
                border: "none",
              }}
            >
              <p className="text-3xl">← ルーム退出</p>
            </motion.button>
          </div>
          {/* 設定ボタン */}
          <div>
            <motion.button
              whileTap={{ scale: 0.8, rotate: -45 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={openConfigModal}
              className="ml-15 px-3 py-3 rounded-4xl bg-white"
              style={{
                color: "#7d7d7d",
                fontFamily: "NicoMoji",
                boxShadow: "0 6px 3px #dee6ee",
                border: "none",
              }}
            >
              <IoSettingsOutline className="text-3xl text-gray-600" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showConfigModal && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={closeConfigModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white p-8 rounded-lg relative w-[90%] max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onClick={closeConfigModal}
                  className="absolute top-3 right-3 text-2xl text-gray-400"
                >
                  <RxCross1 className="text-gray-400" />
                </motion.button>
                <p className="flex items-center justify-center font-semibold text-gray-600 text-xl">
                  設定
                </p>
                {/* 音量調整 */}
                <div className="flex mt-8">
                  <p
                    className="text-center text-xl text-gray-600 ml-5"
                    style={{ fontFamily: "NicoMoji" }}
                  >
                    音量
                  </p>

                  <input
                    type="range"
                    id="volume"
                    min="0"
                    max="100"
                    value="50"
                    onChange={handleVolumeChange}
                    style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
                    className="ml-12"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  } else if (userrole === "client") {
    // クライアント側の表示
    return (
      <div>
        {/* <Arrow rotation={arrowRotation} /> */}

        <div className="relative h-screen bg-white">
          <div className="h-[20vh] px-4 py-25">
            {/* ルーム名 */}
            <h2
              className="text-center text-5xl h-1/2"
              style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
            >
              {roomData.name}
            </h2>
          </div>
          <div className="flex justify-center min-h-[5vh]">
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
          </div>

          <div className="h-[50vh] flex items-center justify-center">
            {/* 円と距離表示 */}
            <div className="w-[40vh] h-[40vh] rounded-full border border-gray-100 flex items-center justify-center relative">
              <div className="text-center">
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
              </div>

              {/* 矢印 */}
              <div
                className="absolute w-[30px] h-[30px] transform origin-bottom"
                style={{
                  top: "0%",
                  left: "50%",
                  transform: `rotate(${arrowRotation}deg) `, // arrowAngle で回転角度を指定
                }}
              >
                {/* 矢印を作成 */}
                <div
                  className="w-0 h-0 border-l-16 border-r-16 border-b-32 border-transparent border-b-red-400"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* 退出ボタン */}
          <div className="h-[15vh] justify-start items-center flex absolute mt-1">
            <div className="">
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={handleExitRoom}
                className="ml-7 px-4 py-2 rounded-4xl bg-white"
                style={{
                  color: "#7d7d7d",
                  fontFamily: "NicoMoji",
                  boxShadow: "2px 6px 3px #dee6ee",
                  border: "none",
                }}
              >
                <p className="text-3xl">← ルーム退出</p>
              </motion.button>
            </div>
            {/* 設定ボタン */}
            <div>
              <motion.button
                whileTap={{ scale: 0.8, rotate: -30 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={openConfigModal}
                className="ml-15 px-3 py-3 rounded-4xl bg-white"
                style={{
                  color: "#7d7d7d",
                  fontFamily: "NicoMoji",
                  boxShadow: "2px 6px 3px #dee6ee",
                  border: "none",
                }}
              >
                <IoSettingsOutline className="text-3xl text-gray-600" />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showConfigModal && (
              <motion.div
                className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={closeConfigModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="bg-white p-8 rounded-lg relative w-[90%] max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    onClick={closeConfigModal}
                    className="absolute top-3 right-3 text-4xl text-gray-400"
                  >
                    <RxCross1 className="text-gray-400 " />
                  </motion.button>
                  <p className="flex items-center justify-center font-semibold text-gray-600 text-2xl">
                    設定
                  </p>
                  {/* 音量調整 */}
                  <div className="flex mt-8">
                    <p className="text-center text-xl text-gray-600 ml-5">音量</p>

                    <input
                      type="range"
                      id="volume"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
                      className="ml-12"
                    />
                  </div>

                  {/* 表示切り替えボタン */}
                  <div className="mt-10 flex items-center justify-center space-x-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      onClick={() => setIs3D(true)}
                      style={{
                        backgroundColor: is3D ? "#ffffff" : "#f0f0f0",
                        fontFamily: "NicoMoji",
                        boxShadow: "0 2px 2px #dee6ee",
                        padding: "0.5rem 2rem",
                        border: "none",
                        borderRadius: "0.5rem",
                      }}
                      className="text-gray-600 text-xl text-semibold"
                    >
                      3D
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      onClick={() => setIs3D(false)}
                      style={{
                        backgroundColor: !is3D ? "#ffffff" : "#f0f0f0",
                        fontFamily: "NicoMoji",
                        boxShadow: "0 2px 2px #dee6ee",
                        padding: "0.5rem 2rem",
                        border: "none",
                        borderRadius: "0.5rem",
                      }}
                      className="text-gray-600 text-xl text-semibold"
                    >
                      2D
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  } else {
    //　それ以外の表示(空のdivタグ)
    return <div></div>;
  }
};

export default Room;
