"use client";
import { useRouter } from "next/navigation";
import { addRoom, generateRoomId } from "@/utils/supabaseFunction";
import { useState } from "react";

const AddRoomForm = () => {
  const router = useRouter();
  const [name, setName] = useState("新しい部屋")
  const [showModal, setShowModal] = useState(false)

  const createRoom = async () => {
    const newRoomId = await generateRoomId();
    await addRoom(newRoomId, name);

    setTimeout(() => {
      router.push(`/${newRoomId}`);
    }, 0);
  };

  const openCreateModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div>
      <button
        onClick={openCreateModal}
        className="w-30 py-2 bg-white text-gray-600"
        style={{
          boxShadow: "2px 6px 3px #dee6ee",

          fontFamily: "NicoMoji",
        }}
      >
        ルームを作成
      </button>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#f9f8f7] rounded-3xl p-6 w-72 shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-2xl text-gray-400"
            >
              ×
            </button>

            <p className="text-center mb-4" style={{ fontFamily: 'NicoMoji', color: '#7d7d7d' }}>
              ルーム名を入力
            </p>

            <input
              type="text"
              placeholder="新しい部屋"
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-5 p-2 text-center bg-[#ddd] rounded"
              style={{ fontFamily: 'NicoMoji', color: '#7d7d7d' }}
            />

            <button
              onClick={() => {
                closeModal()
                createRoom();
              }}
              className="mx-auto block px-6 py-2 bg-white"
              style={{ fontFamily: 'NicoMoji', color: '#7d7d7d', boxShadow: '0 2px 2px #dee6ee' }}
            >
              ルームを作成
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoomForm;
