"use client";
import { useRouter } from "next/navigation";
import { addRoom, generateRoomId } from "@/utils/supabaseFunction";

const AddRoomForm = () => {
  const router = useRouter();

  const createRoom = async () => {
    const newRoomId = await generateRoomId();
    await addRoom(newRoomId);

    setTimeout(() => {
      router.push(`/${newRoomId}`);
    }, 0);
  };

  return (
    <div>
      <button
        onClick={createRoom}
        className="w-30 py-2 #dee6ee bg-white"
        style={{
          boxShadow: "0 2px 2px #dee6ee",
          color: " #7d7d7d",
          fontFamily: "NicoMoji",
        }}
      >
        ルームを作成
      </button>
    </div>
  );
};

export default AddRoomForm;
