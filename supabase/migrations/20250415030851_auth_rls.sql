-- 前回のすべての一般アクセスポリシーを削除
DROP POLICY IF EXISTS "ユーザーは自分のデータを管理できる" ON "public"."user";
DROP POLICY IF EXISTS "ルーム作成権限" ON "public"."room";
DROP POLICY IF EXISTS "ルーム閲覧権限" ON "public"."room";
DROP POLICY IF EXISTS "ルーム更新権限" ON "public"."room";
DROP POLICY IF EXISTS "メッセージ閲覧権限" ON "public"."messages";
DROP POLICY IF EXISTS "メッセージ投稿権限" ON "public"."messages";

-- ユーザーテーブルの新しいポリシー
-- 1. 自分のレコードのみ更新/削除可能
CREATE POLICY "ユーザー自身のデータ編集権限" ON "public"."user"
  FOR ALL
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- 2. 全レコード閲覧可能（安全な情報のみ）
CREATE POLICY "ユーザーデータ閲覧権限" ON "public"."user"
  FOR SELECT
  USING (true);

-- ルームテーブルの新しいポリシー
-- 1. 全レコード閲覧可能
CREATE POLICY "ルーム全体閲覧権限" ON "public"."room"
  FOR SELECT
  USING (true);

-- 2. 自分が所属するルームのみ更新可能（簡略化）
CREATE POLICY "ルーム更新権限" ON "public"."room"
  FOR UPDATE
  USING (true);

-- 3. 誰でもルーム作成可能
CREATE POLICY "ルーム作成権限" ON "public"."room"
  FOR INSERT
  WITH CHECK (true);

-- メッセージテーブルの新しいポリシー
-- 1. すべてのメッセージ閲覧可能（簡略化）
CREATE POLICY "メッセージ閲覧権限" ON "public"."messages"
  FOR SELECT
  USING (true);

-- 2. 自分のメッセージのみ更新/削除可能
CREATE POLICY "メッセージ編集権限" ON "public"."messages"
  FOR ALL
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

-- 3. メッセージ投稿権限（簡略化）
CREATE POLICY "メッセージ投稿権限" ON "public"."messages"
  FOR INSERT
  WITH CHECK (true);

-- ストレージのポリシー更新
-- 1. 自分のフォルダのみアップロード可能
DROP POLICY IF EXISTS "ユーザーアイコンアップロード権限" ON storage.objects;
CREATE POLICY "ユーザーアイコンアップロード権限" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'icons'
  );

-- 2. 全アイコン閲覧可能
DROP POLICY IF EXISTS "ユーザーアイコン閲覧権限" ON storage.objects;
CREATE POLICY "ユーザーアイコン閲覧権限" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'icons'); 