"use client";
import { ResetData } from "@/utils/supabaseFunction";
import { useEffect } from "react";

const DataInitialize = () => {

  useEffect(() => {
    const reset = async () => {
        await ResetData();
    };
    reset();
  }, []);
  return null;
};

export default DataInitialize;
