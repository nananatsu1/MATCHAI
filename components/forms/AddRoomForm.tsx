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
        className="shadow-md border-2 px-4 py-2 rounded-lg bg-green-200 text-black w-48"
      >
        ルームを作る
      </button>
    </div>
  );
};

export default AddRoomForm;
