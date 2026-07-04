#!/bin/bash
# Whatodo 배포 스크립트
# Standalone 출력을 deploy/ 폴더로 복사

set -e

echo "🔨 Next.js 빌드 중..."
npx next build

echo ""
echo "📦 Standalone 출력 복사 중..."
rm -rf deploy
mkdir -p deploy

# standalone 출력 복사 (monorepo 구조 고려)
if [ -d ".next/standalone/apps/whatodo" ]; then
  cp -r .next/standalone/apps/whatodo/* deploy/
else
  cp -r .next/standalone/* deploy/
fi

# .next 폴더 복사 (BUILD_ID 등 포함)
if [ -d ".next" ]; then
  mkdir -p deploy/.next
  cp -r .next/* deploy/.next/
fi

# public 파일 복사 (standalone에 이미 포함되었을 수 있으나 확인)
if [ -d "public" ]; then
  mkdir -p deploy/public
  cp -r public/* deploy/public/ 2>/dev/null || true
fi

echo ""
echo "✅ 배포 준비 완료: deploy/"
echo ""
echo "🚀 실행 방법:"
echo "   cd deploy && node server.js"
echo ""
echo "📤 업로드 방법:"
echo "   - Render:     Blueprint → Upload deploy/ folder"
echo "   - Railway:    railway up (from deploy/)"
echo "   - DigitalOcean: Upload deploy/ as App"
echo "   - AWS:        zip deploy/ and upload to Elastic Beanstalk"
echo "   - VPS:        rsync -av deploy/ user@server:/var/www/whatodo"
