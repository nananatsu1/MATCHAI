# Supabase CLIセットアップガイド

## 前提条件

- Node.js (16.x以上)
- scoopのinstall
- Docker Desktop

## インストール手順

### 1. Supabase CLIのインストール

#### Windowsの場合 (以下の全てのコマンドはPowerShellで)

```powershell
# scoop経由でインストール
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

### 2. Dockerが正しく設定されていることを確認

docker --version

Docker Desktopが起動していることを確認してください。

### 3. プロジェクトフォルダの作成とローカル開発環境の初期化

# プロジェクトフォルダに移動
cd your-project-folder

# Supabaseプロジェクトを初期化
supabase init
```

### 4. ローカルSupabaseを起動

```bash
supabase start -x 
```

初回起動時には必要なDockerイメージがダウンロードされるため、時間がかかることがあります。

### 5. 接続情報の確認

```bash
supabase status
```

このコマンドで表示されるURLとキーは、クライアントアプリケーションで使用します。

## 環境変数の設定

プロジェクトのルートに`.env.local`ファイルを作成し、接続情報を設定します：

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 便利なコマンド

- `supabase start`: ローカル開発環境を起動
- `supabase stop`: ローカル開発環境を停止
- `supabase status`: 接続情報を表示
- `supabase db reset`: データベースをリセット
- `supabase migration new <name>`: 新しいマイグレーションを作成
- `supabase migration up`: マイグレーションを適用
- `supabase db diff`: 現在のデータベースと最新のマイグレーションの差分を表示

## トラブルシューティング

### 一般的な問題

1. **ポートの競合**: 別のアプリケーションが54321ポートを使用している場合、`supabase/config.toml`で変更できます。

2. **IPv6関連のエラー**:
   `supabase/config.toml`で`ip_version = "IPv4"`に設定します。

### 特定のエラーと対処法

- **"Not Acceptable" (406)エラー**: APIリクエストのヘッダーを確認します。
- **"Bad Request" (400)エラー**: テーブルスキーマを確認し、必須フィールドが含まれているか確認します。
- **"Conflict" (409)エラー**: 同時更新の競合の可能性があります。エラーハンドリングを追加してください。

## リンク

- [Supabase CLI公式ドキュメント](https://supabase.com/docs/reference/cli/introduction)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Docker公式ドキュメント](https://docs.docker.com/)
