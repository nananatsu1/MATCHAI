"use client";
import { ResetData } from "@/utils/supabaseFunction";
import { useEffect } from "react";
import useGeolocation from "@/customhooks/useGeolocation";

const DataInitialize = () => {

  const { stopWatching } = useGeolocation();

  useEffect(() => {
    const resetData = async () => {
        await ResetData();
    };

    resetData();
    stopWatching();
  }, []);
  return null;
};

export default DataInitialize;
