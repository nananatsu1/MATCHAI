import { supabase } from "../utils/supabase";

export const getAllClients = async () => {
  const userid = localStorage.getItem("id");

  // room_passを取得
  const { data: thisRoomPass, error } = await supabase
    .from("user")
    .select("room_pass")
    .eq("id", userid)
    .single();

  // エラー処理 & room_pass が null の場合の処理
  if (error || !thisRoomPass?.room_pass) {
    console.error("getAllClients Error: room_pass not found or null", error);
    return [];
  }

  // クライアント情報を取得
  const { data: cliantsData, error: clientError } = await supabase
    .from("user")
    .select("*")
    .eq("room_pass", thisRoomPass.room_pass)
    .eq("role", "client");

  if (clientError) {
    console.error("getAllClients Error:", clientError);
    return [];
  }

  return cliantsData;
};


export const getRealTimeClients = (callback: () => void) => {
  const subscription = supabase
    .channel("user_clients_changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "user" },
      () => {
        callback();
      }
    )
    .subscribe();

  return subscription;
};

export const addUser = async (name: string) => {
  const { data } = await supabase
    .from("user")
    .insert({ name: name })
    .select()
    .single();

  return data.id;
};

export const addRoom = async (pass: number) => {
  const userid = localStorage.getItem("id");
  await supabase
    .from("user")
    .update({ room_pass: pass, role: "host", update_at: new Date() })
    .eq("id", userid);

  await supabase.from("room").insert({ pass: pass });
};

export const generateRoomId = async () => {
  let roomid: number;
  let existingRoom: any;
  do {
    roomid = Math.floor(1000 + Math.random() * 9000);
    existingRoom = await supabase
      .from("room")
      .select("pass")
      .eq("pass", roomid)
      .single();
  } while (existingRoom.data); // 既に存在する場合は再生成

  // 部屋を追加（競合を避けるためにUPSERTを使用）
  await supabase
    .from("room")
    .upsert({ pass: roomid }, { onConflict: "pass" });

  return roomid;
};


export const joinRoom = async (pass: number) => {
  const userid = localStorage.getItem("id");
  await supabase
    .from("user")
    .update({ room_pass: pass, role: "client", update_at: new Date() })
    .eq("id", userid);

  await supabase
    .from("room")
    .update({update_at: new Date() })
    .eq("pass", pass);
};

export const findPassword = async (password: number): Promise<boolean> => {
  const { data, error } = await supabase
    .from("room")
    .select("pass")
    .eq("pass", password)
    .maybeSingle();
  if (error || !data) {
    return false;
  }
  return true;
};

export const isRoomLocking = async (password: number): Promise<boolean> => {
  const { data } = await supabase
    .from("room")
    .select("is_open")
    .eq("pass", password)
    .single(); // passが一致する1件のデータを取得

  await supabase
    .from("room")
    .update({update_at: new Date() })
    .eq("pass", password);

  if (!data) {
    return false;
  } else {
    return data.is_open;
  }
};

export const CheckRole = async () => {
  const userid = localStorage.getItem("id");
  const { data } = await supabase
    .from("user")
    .select("role")
    .eq("id", userid)
    .single();
  return data?.role || null;
};

export const updateLocation = async (
  latitude: number,
  longitude: number,
  altitude: number
) => {
  const userid = localStorage.getItem("id");
  await supabase
    .from("user")
    .update({ latitude: latitude, longitude: longitude, altitude: altitude, update_at: new Date() })
    .eq("id", userid);
};

export const getMyLocation = async () => {
  const userid = localStorage.getItem("id");
  const data = await supabase
    .from("user")
    .select("latitude, longitude")
    .eq("id", userid)
    .single();

  return data;
};

export const getHostLocation = async () => {
  const userid = localStorage.getItem("id");
  const mydata = await supabase
    .from("user")
    .select("room_pass")
    .eq("id", userid)
    .single();
  const pass = mydata.data?.room_pass;

  const data = await supabase
    .from("user")
    .select("latitude, longitude")
    .eq("room_pass", pass) // room_passが一致するユーザーをフィルタリング
    .eq("role", "host") // roleが"host"であるユーザーを対象
    .single();
  return data;
};

// 自分 & ホストの位置情報を取得する関数（まとめて取得）
export const fetchLocations = async () => {
  const myLatestLocation = await getMyLocation();
  const hostLatestLocation = await getHostLocation();

  return {
    myLatitude: myLatestLocation?.data?.latitude || null,
    myLongitude: myLatestLocation?.data?.longitude || null,
    hostLatitude: hostLatestLocation?.data?.latitude || null,
    hostLongitude: hostLatestLocation?.data?.longitude || null,
  };
};

export const GetRealTimeLocations = (callback: () => void) => {
  const subscription = supabase
    .channel("user_location_changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "user" },
      (payload) => {
        // 変更されたカラムをチェック
        const updatedColumns = Object.keys(payload.new);
        
        // latitude, longitude, altitude のいずれかが更新された場合のみ callback を実行
        if (
          updatedColumns.includes("latitude") ||
          updatedColumns.includes("longitude") ||
          updatedColumns.includes("altitude")
        ) {
          callback();
        }
      }
    )
    .subscribe();

  return subscription;
};

export const setDistance = async (distance: number) => {
  const userid = localStorage.getItem("id");
  await supabase
    .from("user")
    .update({ distance: distance, update_at: new Date() })
    .eq("id", userid);
};

export const ResetData = async () => {
  const userid = localStorage.getItem("id");
  await supabase
    .from("user")
    .update({
      latitude: null,
      longitude: null,
      altitude: null,
      distance: null,
      room_pass: null,
      role: null,
      update_at: new Date(),
    })
    .eq("id", userid);
};
