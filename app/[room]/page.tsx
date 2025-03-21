'use client'
import { CheckRole } from "@/utils/supabaseFunction";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Room = () => {
  const [userrole, setUserrole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      const role = await CheckRole();
      setUserrole(role);
    };
    checkUserRole();
  }, []);

  if(userrole === 'host'){
    //ホスト側の表示
    return(
        <div>
          host
        </div>

    );
  }else if(userrole === 'client'){
    //クライアント側の表示
    return(
        <div>
          client
        </div>

    );
  }else{
    return router.push(`/`);
  }
};

export default Room;
