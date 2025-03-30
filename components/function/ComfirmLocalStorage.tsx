"use client";

import { useEffect } from "react";
import { addUser, getUserById } from "@/utils/supabaseFunction"; // getUserById関数を追加でインポート

const ConfirmLocalStorage = () => {

  useEffect(() => {
    const setStorage = async () => {
      const existId = await localStorage.getItem("id");

      if (existId) {
        // idがlocalStorageにある場合、userテーブルにそのidが存在するか確認
        const { data: existingUser, error: userError } = await getUserById(existId);

        if (userError || !existingUser) {
          // idに対応するユーザーがいない場合、新規ユーザーを作成
          const userId = await addUser("Guest");
          await localStorage.setItem("id", userId);
        }
      } else {
        // idがない場合、新規ユーザーを作成
        const userId = await addUser("Guest");
        await localStorage.setItem("id", userId);
      }
    };

    setStorage();
  }, []);

  return null;
};

export default ConfirmLocalStorage;
