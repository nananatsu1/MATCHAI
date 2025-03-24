"use client";
import {
  findPassword,
  isRoomLocking,
  joinRoom,
} from "@/utils/supabaseFunction";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const JoinRoomForm = () => {
  const [password, setPassword] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const borderColors = ["#9fd8ee", "#c5e2c2", "#f7c6bd", "#c5a3cb"];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const passwordNumber = Number(password.join(""));
    if (passwordNumber === null || isNaN(passwordNumber)) {
      setError("パスワードを入力してください");
      return;
    }
    setError(null);

    const existPassword = await findPassword(passwordNumber);
    if (existPassword) {
      if (await isRoomLocking(passwordNumber)) {
        await joinRoom(passwordNumber);
        router.push(`/${passwordNumber}`);
      } else {
        setError("そのルームにはカギがかかっています");
        return;
      }
    } else {
      setError("そのルームは存在していません");
      return;
    }
    setError(null);
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPassword = [...password];
    newPassword[index] = value;
    setPassword(newPassword);

    if (value !== "" && index < 3 && inputRefs.current[index + 1]) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 100); // 小さな遅延を加えて二重移動を防ぐ
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex justify-center gap-4 mb-6">
          {password.map((val, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text" // そのまま
              inputMode="numeric" // 数字キーボードを開く
              pattern="[0-9]" // 数字のみ許可
              maxLength={1}
              className="w-12 h-15 border-2 rounded-lg text-center text-xl outline-none"
              style={{
                borderColor: borderColors[index],
                color: "#7d7d7d",
                fontFamily: "NicoMoji",
              }}
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.preventDefault();
                  const newPassword = [...password];
                  newPassword[index] = "";
                  setPassword(newPassword);
                  if (index > 0) {
                    setTimeout(() => {
                      inputRefs.current[index - 1]?.focus();
                    }, 50);
                  }
                }
              }}
            />
          ))}
        </div>
        <button
          className="w-30 py-2 mb-4 #7d7d7d  #dee6ee bg-white font-nico"
          style={{
            boxShadow: "0 2px 2px #dee6ee",
            color: " #7d7d7d",
            fontFamily: "NicoMoji",
          }}
        >
          ルームに参加
        </button>
      </form>
    </div>
  );
};

export default JoinRoomForm;
