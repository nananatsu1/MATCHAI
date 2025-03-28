"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CheckRole } from "@/utils/supabaseFunction";

import useCalclation from "@/customhooks/useCalclation";

import ShowRoomDetails from "@/components/elements/host/ShowRoomDetails";
import ShowClients from "@/components/elements/host/ShowClients";
import HostExit from "@/components/elements/host/HostExit";
import HostSettings from "@/components/elements/host/HostSettings";

import ShowRoom from "@/components/elements/client/ShowRoom";
import GyroRequest from "@/components/elements/client/GyroRequest";
import ShowDistance from "@/components/elements/client/ShowDistance";
import ClientExit from "@/components/elements/client/CliwntExit";
import ClientSettings from "@/components/elements/client/ClientSettings";

const Room = () => {
  const router = useRouter();
  const [userrole, setUserrole] = useState<string | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [timeoutDone, setTimeoutDone] = useState(false);
  const { distance = 0 } = useCalclation();
  const [showAltitude, setShowAltitude] = useState(false);

  //ユーザにロールを付与
  useEffect(() => {
    const checkUserRole = async () => {
      const role = await CheckRole();
      setUserrole(role);
      if (
        (userrole !== null && userrole !== "host" && userrole !== "client") ||
        localStorage.getItem("id") == null
      ) {
        router.push(`/`);
      }
    };
    checkUserRole();
  }, []);

  useEffect(() => {
    let isMounted = true; // メモリリーク防止用フラグ

    document.fonts.ready.then(() => {
      if (isMounted) setFontsReady(true);
    });

    const timer = setTimeout(() => {
      if (isMounted) setTimeoutDone(true);
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (userrole === "host") {
    // ホスト側の表示
    return (
      <div className="relative h-screen bg-white">
        {/* ルーム名 */}
        <ShowRoomDetails />

        {/* クライアント表示 */}
        <ShowClients />

        <div className="h-[15vh] justify-start items-center flex absolute mt-1">
          {/* 退出ボタン */}
          <HostExit />

          {/* 設定ボタン */}
          <HostSettings distance={distance} />
        </div>
      </div>
    );
  } else if (userrole === "client") {
    // クライアント側の表示
    return (
      <div>
        <div className="relative h-screen bg-white">
          {/* ルーム名 */}
          <ShowRoom />

          {/* センサー許可 */}
          <GyroRequest />

          {/* 距離表示 */}
          <ShowDistance showAltitude={showAltitude} />

          <div className="h-[15vh] justify-start items-center flex absolute mt-1">
            {/* 退出ボタン */}
            <ClientExit />

            {/* 設定ボタン */}
            <ClientSettings
              showAltitude={showAltitude}
              setShowAltitude={setShowAltitude}
              distance={distance}
            />
          </div>
        </div>
      </div>
    );
  } else {
    //　それ以外の表示(空のdivタグ)
    return <div></div>;
  }
};

export default Room;