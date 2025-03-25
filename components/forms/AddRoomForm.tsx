"use client";
import { useRouter } from "next/navigation";
import { addRoom, generateRoomId } from "@/utils/supabaseFunction";
import { useState } from "react";
import { motion } from "framer-motion";
import { RxCross1 } from "react-icons/rx";

const AddRoomForm = () => {
  const router = useRouter();
  const [name, setName] = useState("新しい部屋");
  const [showModal, setShowModal] = useState(false);

  const createRoom = async () => {
    const newRoomId = await generateRoomId();
    await addRoom(newRoomId, name);

    setTimeout(() => {
      router.push(`/${newRoomId}`);
    }, 0);
  };

  const openCreateModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="mt-8">
      <motion.button
        onClick={openCreateModal}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-45 h-13 mx-auto block px-4 py-2 mb-8 bg-white rounded-xl"
        style={{
          boxShadow: "2px 6px 3px #dee6ee",
          fontFamily: "NicoMoji",
        }}
      >
        <p className="text-gray-600 text-2xl">
          ルームを作成
        </p>
      </motion.button>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#f9f8f7] rounded-3xl p-6 w-72 shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-2xl text-gray-400"
            >
              <RxCross1  className="text-gray-400 "/>
            </button>

            <p
              className="text-center mt-10 mb-4 text-3xl"
              style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
            >
              ルーム名を入力
            </p>

            <input
              type="text"
              placeholder="新しい部屋"
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 mb-6 p-2 text-2xl text-center bg-[#ddd] rounded-xl"
              style={{ fontFamily: "NicoMoji", color: "#7d7d7d" }}
            />

            <motion.button
              onClick={() => {
                closeModal();
                createRoom();
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mx-auto block px-4 py-2 text-2xl rounded-xl bg-white"
              style={{
                fontFamily: "NicoMoji",
                color: "#7d7d7d",
                boxShadow: "0 2px 2px #dee6ee",
              }}
            >
              ルームを作成
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoomForm;
