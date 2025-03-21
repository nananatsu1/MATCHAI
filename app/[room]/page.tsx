'use client'

import useCalclation from "@/customhooks/useCalclate";
import Arrow from "@/components/Arrow";
import { CheckRole } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useGyroCompass from "@/customhooks/useGyroCompass";

const Room = () => {
  const [userrole, setUserrole] = useState<string | null>(null);
  const router = useRouter();
  const { distance, angle } = useCalclation(); 
  const { rotation } = useGyroCompass();
  const [arrowRotation, setArrowRotation] = useState(0);
  
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
    if (userrole !== null && userrole !== 'host' && userrole !== 'client') {
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
        client
        <Arrow rotation={arrowRotation}/>
          距離: {distance}
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
