"use client";
import { useRouter } from "next/navigation";
import { addRoom } from "@/utils/supabaseFunction";

const AddRoomForm = () => {
  const router = useRouter();

  const generateRoomId = () => Math.floor(1000 + Math.random() * 9000);

  const createRoom = async () => {
    const newRoomId = generateRoomId();
    await addRoom(newRoomId);
    router.push(`/${newRoomId}`);
  };

  return (
    <div>
      <button
        onClick={createRoom}
        className="shadow-md border-2 px-4 py-2 rounded-lg bg-green-200 text-black w-48"
      >
        ルームを作る
      </button>
    </div>
  );
};

export default AddRoomForm;
