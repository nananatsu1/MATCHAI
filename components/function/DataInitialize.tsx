"use client";
import { ResetData } from "@/utils/supabaseFunction";
import { useEffect } from "react";

const DataInitialize = () => {

  useEffect(() => {
    const resetData = async () => {
        await ResetData();
    };

    resetData();
  }, []);
  return null;
};

export default DataInitialize;
