'use client'
import { findPassword, isRoomLocking, joinRoom } from '@/utils/supabaseFunction';
import React, { useState } from 'react'
import { useRouter } from "next/navigation";

const JoinRoomForm = () => {
    const [password, setPassword] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (password === null || isNaN(password)) {
          setError("パスワードを入力してください");
          return;
        }
        setError(null);
    
        const existPassword = await findPassword(password);
        console.log(existPassword);
        if(existPassword){
          if(await isRoomLocking(password)){
            await joinRoom(password);
            router.push(`/${password}`)
          }else{
            setError("そのルームにはカギがかかっています");
            return;
          }
            
        }else{
          setError("そのルームは存在していません");
          return;
        }
        setError(null);
      };

  return (
    <div>
        <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="number"
              className="p-2 outline-none bg-white text-black w-48 border rounded-lg"
              onChange={(e) => setPassword(e.target.value ? parseInt(e.target.value) : null)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <button className="shadow-md border-2 px-4 py-2 rounded-lg bg-green-200 text-black w-48">
              ルームに参加
            </button>
          </form>
    </div>
  )
}

export default JoinRoomForm