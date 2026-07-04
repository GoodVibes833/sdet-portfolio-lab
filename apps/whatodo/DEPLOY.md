# Whatodo 배포 가이드

## 요구사항
- Node.js 18+
- npm 또는 yarn

## 로컬 빌드 및 실행

```bash
# 1. 빌드
npm run build

# 2. Standalone 서버 실행
cd .next/standalone/apps/whatodo
node server.js

# 또는 deploy 스크립트 사용
chmod +x deploy.sh
./deploy.sh
cd deploy
node server.js
```

서버가 `http://localhost:3000` 에서 실행됨.

## 플랫폼별 배포

### Render (무료)
1. [render.com](https://render.com) 가입
2. Blueprint 선택 → Upload folder
3. `deploy/` 폴더 업로드
4. Start command: `node server.js`

### Railway (무료)
1. [railway.app](https://railway.app) 가입
2. `railway login`
3. `cd deploy && railway init && railway up`

### DigitalOcean App Platform
1. `deploy/` 폴더를 ZIP으로 압축
2. App Platform → Upload ZIP
3. Build command: 없음 (이미 빌드됨)
4. Run command: `node server.js`

### AWS (Elastic Beanstalk)
1. `cd deploy && zip -r ../whatodo.zip .`
2. Elastic Beanstalk → Upload ZIP
3. Platform: Node.js

### VPS (직접 서버)
```bash
# 로컬에서
rsync -av deploy/ user@your-server:/var/www/whatodo

# 서버에서
ssh user@your-server
cd /var/www/whatodo
npm install pm2 -g
pm2 start server.js --name whatodo
```

## 환경변수
필요한 경우 `.env.local` 파일에 추가:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_YELP_API_KEY=
```
