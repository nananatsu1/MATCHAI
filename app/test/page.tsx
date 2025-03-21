import useGeolocation from "@/customhooks/useGeolocation";
import React, { useEffect, useState } from "react";

const test = () => {

  const [position, setPosition] = useState<{
    latitude: number | null;
    longitude: number | null;
    altitude: number | null; // 追加
  }>({
    latitude: null,
    longitude: null,
    altitude: null, // 追加
  });
  const { latitude, longitude, error } = useGeolocation();
  
  return <div>test</div>;
};

export default test;
