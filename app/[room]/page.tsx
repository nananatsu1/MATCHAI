'use client'

import useCalclation from "@/customhooks/useCalclation";

import Arrow from "@/components/Arrow";
import { CheckRole } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useGyroCompass from "@/customhooks/useGyroCompass";
import useGeolocation from "@/customhooks/useGeolocation";
import ComfirmLocalStorage from "@/components/function/ComfirmLocalStorage";

const Room = () => {
  const [userrole, setUserrole] = useState<string | null>(null);
  const router = useRouter();
  const { distance = 0, angle = 0 } = useCalclation(); 
  const { latitude, longitude } = useGeolocation();

  /* const { rotation, permissionGranted, requestPermission } = useGyroCompass();
  const [arrowRotation, setArrowRotation] = useState<number>(0);
  
  // 目的地の向きを計算
  useEffect(() => {
      if (angle !== null && rotation !== null) {
          setArrowRotation((angle - rotation + 360) % 360);
      }
  }, [angle, rotation]);
 */
  //ユーザにロールを付与
  useEffect(() => {
      const checkUserRole = async () => {
      const role = await CheckRole();
      setUserrole(role);
      };
      checkUserRole();
  }, []);

  //ユーザのロールを監視
  useEffect(() => {
    if (userrole !== null && userrole !== 'host' && userrole !== 'client' || localStorage.getItem("id") == null) {
      router.push(`/`);
      }
  }, [userrole, router]);

  if (userrole === 'host') {
    // ホスト側の表示
    return (
      <div>
        host
      </div>
    );
  } else if (userrole === 'client') {
    // クライアント側の表示
    return (
      <div>

        client <br />

        {/* {!permissionGranted && (
        <button
          onClick={requestPermission}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          センサーの許可
        </button>
      )}

        <Arrow rotation={arrowRotation}/> */}
          距離: {distance} <br />
          緯度: {latitude} <br />
          経度: {longitude} <br />
      </div>
    );
  }else{
    //　それ以外の表示(空のdivタグ)
    return (
        <div></div>
    );
  }
};

export default Room;
