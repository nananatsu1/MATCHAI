import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetTables() {
  // 現在時刻を取得
  const currentDate = new Date();

  // room テーブルの update_at が 6 時間前のレコードを削除
  const sixHoursAgo = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000);
  const { data: rooms, error: roomsError } = await supabase
    .from('room')
    .select('id')
    .lt('update_at', sixHoursAgo.toISOString()); // 6 時間前より古いレコードを取得

  if (roomsError) {
    console.error('Error fetching rooms:', roomsError);
    return;
  }

  if (rooms?.length > 0) {
    const roomIds = rooms.map((room) => room.id);
    const { error: deleteRoomsError } = await supabase
      .from('room')
      .delete()
      .in('id', roomIds);

    if (deleteRoomsError) {
      console.error('Error deleting rooms:', deleteRoomsError);
    } else {
      console.log(`Successfully deleted ${roomIds.length} rooms.`);
    }
  }

  // user テーブルの update_at が 30 日前のレコードを削除
  const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const { data: users, error: usersError } = await supabase
    .from('user')
    .select('id')
    .lt('update_at', thirtyDaysAgo.toISOString()); // 30 日前より古いレコードを取得

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }

  if (users?.length > 0) {
    const userIds = users.map((user) => user.id);
    const { error: deleteUsersError } = await supabase
      .from('user')
      .delete()
      .in('id', userIds);

    if (deleteUsersError) {
      console.error('Error deleting users:', deleteUsersError);
    } else {
      console.log(`Successfully deleted ${userIds.length} users.`);
    }
  }
}

// スクリプト実行
resetTables().catch((err) => {
  console.error('Unexpected error:', err);
});
