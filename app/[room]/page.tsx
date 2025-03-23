'use client'

import useCalclation from "@/customhooks/useCalclation";

import Arrow from "@/components/Arrow";
import { CheckRole } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useGyroCompass from "@/customhooks/useGyroCompass";
import useGeolocation from "@/customhooks/useGeolocation";

const Room = () => {
  const [userrole, setUserrole] = useState<string | null>(null);
  const router = useRouter();
  const { distance = 0, angle = 0 } = useCalclation(); 
  const { startWatching } = useGeolocation();

  const { rotation, permissionGranted, requestPermission } = useGyroCompass();
  const [arrowRotation, setArrowRotation] = useState<number>(0);
  
  // 目的地の向きを計算
  useEffect(() => {
      if (angle !== null && rotation !== null) {
          setArrowRotation((angle - rotation + 360) % 360);
      }
  }, [angle, rotation]);
 
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

  useEffect(() => {
    startWatching();
  }, []);

  // 距離を整形する関数
  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(3)} km`; // 小数第三位まで表示
    }
    return `${Math.round(distance)} m`; // 小数点なしで表示
  };

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

        {!permissionGranted && (
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            センサーの許可
          </button>
        )}

        <Arrow rotation={arrowRotation}/> 
          距離: 約 {formatDistance(distance)} <br />
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
