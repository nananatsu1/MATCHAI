"use client";
import { addUser } from "@/utils/supabaseFunction";
import { useEffect } from "react";

const ConfirmLocalStorage = () => {

  useEffect(() => {
    const setStorage = async () => {
      const existId = await localStorage.getItem("id");
        if (existId) {
          await localStorage.setItem("id",existId);
        }else{
            // IDがない場合、新規ユーザーを作成
          const userId = await addUser("Guest");
          await localStorage.setItem("id",userId);
        }
  };
    setStorage();
  }, []);
  return null;
};

export default ConfirmLocalStorage;
