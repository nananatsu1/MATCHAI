import { supabase } from "../utils/supabase";

export const getAllClients = async () => {
  const userid = localStorage.getItem("id");

  const thisRoomPass = await supabase
    .from("user")
    .select("room_pass")
    .eq("id", userid)
    .single();

  console.log(thisRoomPass);
  const cliantsData = await supabase
    .from("user")
    .select("*")
    .eq("room_pass", thisRoomPass.data?.room_pass)
    .eq("role", "client");

  return cliantsData.data;
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
    .update({ room_pass: pass, role: "host" })
    .eq("id", userid);

  await supabase.from("room").insert({ pass: pass });
};

export const generateRoomId = async () => {
  let roomid: number;
  let data: any;
  do {
    roomid = Math.floor(1000 + Math.random() * 9000);
    data = await supabase
      .from("room")
      .select("pass")
      .eq("pass", roomid)
      .single();
  } while (!data);
  await supabase.from("room").insert({ pass: roomid });
  return roomid;
};

export const joinRoom = async (pass: number) => {
  const userid = localStorage.getItem("id");
  await supabase
    .from("user")
    .update({ room_pass: pass, role: "client" })
    .eq("id", userid);
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
    .update({ latitude: latitude, longitude: longitude, altitude: altitude })
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
      () => {
        callback();
      }
    )
    .subscribe();

  return subscription;
};

export const setDistance = async (distance: number) => {
  const userid = localStorage.getItem("id");
  await supabase
    .from("user")
    .update({ distance: distance })
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
    })
    .eq("id", userid);
};
