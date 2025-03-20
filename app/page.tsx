'use client'

import { addUser } from '@/utils/supabaseFunction';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Home = () => {

  const [name, setName] = useState<string>("");

  /* const handleSubmit = async (e:any) => {
    e.preventDefault();

    await addUser(name);
  } */

    const generateRoomId = () => Math.floor(1000 + Math.random() * 9000).toString();

    const createRoom = () => {
      const newRoomId = generateRoomId();
  
      /* setRoomId(newRoomId);
      setUserRole("host"); // ホストとして参加
      alert(`ルームID: ${newRoomId}`);
   */
      // ルームを作成し、ホストの情報を保存
      useRouter().push('/room')
    };

    const joinRoom = () => {
      useRouter().push('/room')
    }
  
  useEffect(() => {
    const fetchData = async () => {
      const userId = await addUser("Guest");
      // Cookieを設定（有効期限30日間）
      Cookies.set('id', userId, { expires: 30 });
    }
    
    // 既存のCookieがある場合は期限を更新
    const existId = Cookies.get('id');
    if (existId) {
      Cookies.set('id', existId, { expires: 30 }); // 有効期限を30日に更新
    } else {
      fetchData();
    }
  }, []);
    

  return (
    <div>
      <section className="text-center mb-2 text-2xl font-medium">
        <h3 className="mb-4">Home</h3>
        <div className="flex flex-col items-center gap-4">
          <button onClick={createRoom} className="shadow-md border-2 px-4 py-2 rounded-lg bg-green-200 text-black w-48">
            ルームを作る
          </button>
          <input 
            type="text" 
            className="p-2 outline-none bg-white text-black w-48 border rounded-lg" 
            onChange={(e) => setName(e.target.value)} 
            placeholder="ルームID"
          />
          <button onClick={joinRoom} className="shadow-md border-2 px-4 py-2 rounded-lg bg-green-200 text-black w-48">
            ルームに参加
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home