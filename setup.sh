#!/usr/bin/env bash
set -e

echo "=== Keiba Tracker セットアップ ==="

# Backend: Gradle wrapper を生成
echo ""
echo "[1/2] Backend: Gradle wrapper を生成中..."
cd backend
gradle wrapper
cd ..
echo "  完了"

# Frontend: npm install
echo ""
echo "[2/2] Frontend: パッケージをインストール中..."
cd frontend
npm install
cd ..
echo "  完了"

echo ""
echo "=== セットアップ完了 ==="
echo ""
echo "次のステップ:"
echo ""
echo "1. Turso の設定:"
echo "   turso db create keiba-tracker"
echo "   turso db show keiba-tracker --url   # URL を取得"
echo "   turso db tokens create keiba-tracker # トークンを取得"
echo ""
echo "2. backend/.env ファイルを作成:"
echo "   cp backend/.env.example backend/.env"
echo "   # .env ファイルを編集して URL とトークンを設定"
echo ""
echo "3. バックエンドを起動:"
echo "   cd backend && ./gradlew bootRun"
echo ""
echo "4. フロントエンドを起動 (別ターミナル):"
echo "   cd frontend && npm run dev"
echo ""
echo "   → http://localhost:5173 でアクセス"
