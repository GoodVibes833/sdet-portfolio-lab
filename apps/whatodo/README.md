# 오늘 뭐하지? (Whatodo)

> 캐나다 워킹홀리데이 한국인을 위한 현지 핫플레이스 발견 플랫폼

🔗 **Production**: https://whatodo-seven.vercel.app

---

## 프로젝트 개요

"오늘 뭐하지?"는 캐나다에 거주하거나 방문하는 한국인을 대상으로, 현지 맛집·관광·액티비티·카페 등을 지도 기반으로 탐색하고 공유하는 웹 애플리케이션이다. 찜·방문·리뷰·태그·컬렉션·게이미피케이션 등 개인화된 경험과 소셜 기능을 통해 사용자 참여를 극대화한다.

### 핵심 가치
- **신뢰** — 한국인 커뮤니티의 실제 방문 기록과 리뷰 기반
- **편의** — 지도 기반 실시간 탐색 + 개인화된 저장/관리
- **연결** — 비슷한 취향의 사용자들과 장소 공유
- **재미** — 게이미피케이션으로 탐험 동기 부여

---

## 기술 스택

| 계층 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 + React 19 |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS 4 |
| 지도 | Leaflet.js + OpenStreetMap |
| 아이콘 | Lucide React |
| 배포 | Vercel |

---

## 주요 기능 (9개 Phase 완료)

| Phase | 내용 |
|-------|------|
| **1** | 찜/방문/리뷰/태그/메모/컬렉션 |
| **2** | 검색 자동완성, 하이라이트, 필터 프리셋, 정렬 |
| **3** | 거리 측정, GPS 트래킹, 인근 장소 |
| **4** | 전화, 이미지 라이트박스, 유사 추천 |
| **5** | QR 공유, 템플릿, 네이버 공유, OG 태그, 투표 |
| **6** | 포인트/레벨/배지, 룰렛 |
| **7** | 온보딩, 폰트/고대비 설정, PWA |
| **8** | CSV보내기, 프린트 |
| **9** | 세계 시계, 도움말 |

---

## 문서

| 문서 | 내용 |
|------|------|
| [01_VISION.md](docs/01_VISION.md) | 프로젝트 비전, 시장 필요성, 경쟁 분석 |
| [02_BUSINESS_MODEL.md](docs/02_BUSINESS_MODEL.md) | 비즈니스 모델, 수익화 전략 |
| [03_ARCHITECTURE.md](docs/03_ARCHITECTURE.md) | 시스템 아키텍처, 기술 스택, 디렉토리 구조 |
| [04_FEATURES.md](docs/04_FEATURES.md) | Phase별 기능 상세 |
| [05_DATA_MODEL.md](docs/05_DATA_MODEL.md) | 데이터 모델, 상태 관리 |
| [06_STRATEGY.md](docs/06_STRATEGY.md) | 시장 접근법, 마케팅, 성장 전략 |
| [07_ROADMAP.md](docs/07_ROADMAP.md) | 제품 로드맵 (v2.0, v3.0) |
| [08_DEPLOYMENT.md](docs/08_DEPLOYMENT.md) | 배포 가이드, 운영 |

---

## 빠른 시작

```bash
npm install
npm run dev
# http://localhost:3000

# 프로덕션 배포
npm run build
npx vercel --prod
```

---

*최종 업데이트: 2026-05-14*
