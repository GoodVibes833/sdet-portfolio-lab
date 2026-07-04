#!/bin/bash
set -e

echo "========================================="
echo "🌎 캐나다 장소 대량 수집 시작"
echo "========================================="
echo ""

cd "$(dirname "$0")/.."

echo "1️⃣ Overpass API (OpenStreetMap) 수집..."
node scripts/collect-overpass.js
echo ""

echo "2️⃣ Google Maps 브라우저 수집..."
node scripts/collect-maps.js
echo ""

echo "3️⃣ 데이터 병합 + 검증..."
node scripts/merge-and-validate.js
echo ""

echo "========================================="
echo "✅ 수집 완료!"
echo "========================================="
echo ""
echo "다음 명령으로 빌드하세요:"
echo "  npm run build"
