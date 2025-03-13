"use client";
import { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import db from "@/firebaseConfig";

const generateRoomId = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function RoomPage() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [inputRoomId, setInputRoomId] = useState("");
  const [position, setPosition] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [users, setUsers] = useState<{ [key: string]: { latitude: number; longitude: number } }>({});

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });

        if (roomId) {
          set(ref(db, `rooms/${roomId}/users/${Date.now()}`), { latitude, longitude });
        }
      });
    }
  }, [roomId]);

  const createRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    alert(`ルームID: ${newRoomId}`);
  };

  const joinRoom = () => {
    setRoomId(inputRoomId);
    onValue(ref(db, `rooms/${inputRoomId}/users`), (snapshot) => {
      setUsers(snapshot.val() || {});
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">位置情報ルーム</h1>

      {!roomId ? (
        <>
          <button onClick={createRoom} className="px-4 py-2 bg-blue-500 text-white rounded-md">ルームを作る</button>
          <input type="text" value={inputRoomId} onChange={(e) => setInputRoomId(e.target.value)} placeholder="ルームIDを入力" className="border p-2 mt-4"/>
          <button onClick={joinRoom} className="px-4 py-2 bg-green-500 text-white rounded-md mt-2">ルームに参加</button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mt-4">ルームID: {roomId}</h2>
          <p>緯度: {position.latitude} / 経度: {position.longitude}</p>
          <h3 className="text-lg font-bold mt-4">他の参加者</h3>
          <ul>
            {Object.keys(users).map((key) => (
              <li key={key}>緯度: {users[key]?.latitude}, 経度: {users[key]?.longitude}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
