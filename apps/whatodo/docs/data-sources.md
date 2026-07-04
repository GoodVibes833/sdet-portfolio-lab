# 캐나다가자 장소 데이터 수집 전략

> 목표: 캐나다 주요 도시(8개)의 장소 데이터를 **비용 0원**에 가장 많이, 가장 정확하게 수집

---

## 1. 데이터 소스 비교표

| 소스 | 무료 한도 | 가입/카드 | 데이터 품질 | 한국인 관련성 | 우선순위 |
|------|----------|----------|------------|-------------|---------|
| **OpenStreetMap (OSM)** | 무제한 | ❌ 없음 | 중 (지역 편차) | 낮음 (영어 위주) | ⭐ 1순위 |
| **Google Places API** | $200/월 (≈6,600회) | ✅ 필수 | 최상 | 중간 | 💰 2순위 |
| **Foursquare Places API** | 500회/일 | ✅ 가입 | 중상 | 낮음 | 3순위 |
| **Yelp Fusion API** | 500회/일 | ✅ 가입 | 중상 (식당 전문) | 중간 | 3순위 |
| **직접 수집 / 유저 제보** | 무제한 | ❌ 없음 | 최상 | 최상 | ⭐ 병행 |

### 한 줄 요약
> **OSM으로 베이스를 깔고 → Google 무료 티어로 인기 장소 보강 → 유저 제보로 한국인 특화 정보 채우기**

---

## 2. OSM (OpenStreetMap) — 완전 무료 베이스라인

### 왜 먼저?
- API 키 없이 바로 사용 가능
- Overpass API는 하루 요청 제한 없음 (단, 예의상 1초에 1회 권장)
- 이름, 좌표, 주소, 전화번호, 웹사이트, 영업시간, 태그(한식/디저트 등) 제공

### Overpass API 쿼리 예시 (토론토 식당)
```overpass
[out:json][timeout:60];
area["name"="Toronto"]->.searchArea;
(
  node["amenity"="restaurant"](area.searchArea);
  way["amenity"="restaurant"](area.searchArea);
  node["amenity"="cafe"](area.searchArea);
  way["amenity"="cafe"](area.searchArea);
);
out center body 200;
```

### OSM → 우리 Place 타입 매핑
| OSM 태그 | 우리 Category | 우리 Tags |
|---------|--------------|----------|
| `amenity=restaurant` + `cuisine=korean` | 맛집 | `한식`, `Korean` |
| `amenity=restaurant` + `cuisine=japanese` | 맛집 | `일식`, `Sushi` |
| `amenity=cafe` + `cuisine=coffee_shop` | 카페 | `카페`, `디저트` |
| `tourism=attraction` | 관광 | `관광지` |
| `shop=convenience` | 쇼핑 | `편의점`, `마트` |
| `natural=beach` | 자연 | `해변` |
| `tourism=viewpoint` | 야경 | `야경`, `전망대` |

### 주의사항
- OSM은 **누구나 편집**하는 위키식 DB라 정보가 부정확하거나 outdated일 수 있음
- `lastUpdated` 필드에 OSM 데이터 수집일 기록 필수
- 한국어 이름 거의 없음 → `nameEn`에 영어 이름, `name`은 수동 번역 또는 그대로

---

## 3. Google Places API (New) — 품질 업그레이드

### 무료 한도
- **월 $200 크레딧** ≈ **Text Search 6,600회** 또는 **Place Details 13,300회**
- 초과 시: Text Search 1,000회당 $17, Place Details 1,000회당 $8

### 무엇을 위해?
1. **사진**: OSM에 없는 장소 사진 URL (1,000×1,000 이상)
2. **리뷰 점수**: `rating` 필드 보강 (OSM에는 없음)
3. **영업시간**: `openHours` 정확한 문자열
4. **가격대**: `priceLevel` 0~3 매핑

### 전략
- OSM으로 수집한 장소 중 **rating이 없거나 사진이 없는** 것만 Google에 쿼리
- 결과를 **24시간 캐싱** (로컬 JSON 파일) → 동일 장소 재요청 방지

---

## 4. Foursquare + Yelp — 보조 소스

| | Foursquare | Yelp |
|---|-----------|------|
| 무료 | 500회/일 | 500회/일 |
| 강점 | 장소 팁(리뷰), 사진 | 식당 전문, 가격대, 리뷰 점수 |
| 한국인 관련 | 낮음 | 중간 (캐나다 한인 식당 리뷰 있음) |
| 필요한 것 | Client ID + Secret | API Key |

### 전략
- OSM/Google로 커버 안 되는 **한인 타운 장소**만 Foursquare/Yelp로 보강
- Yelp는 `locale=ko_KR` 파라미터로 한국어 리뷰 요청 가능

---

## 5. 자동화 파이프라인

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  GitHub     │────▶│  OSM Fetch   │────▶│  JSON 저장   │
│  Actions    │     │  (Overpass)  │     │  (raw/)      │
│  (매일 새벽) │     └──────────────┘     └──────────────┘
└─────────────┘                                  │
                                                 ▼
                                        ┌──────────────┐
                                        │  Place 변환  │
                                        │  (osm→Place) │
                                        └──────────────┘
                                                 │
                    ┌──────────────┐            ▼
                    │  수동 검수   │◀───  ┌──────────────┐
                    │  (diff 확인) │      │  PR 생성     │
                    └──────────────┘      │  (src/data)  │
                           │              └──────────────┘
                           ▼
                    ┌──────────────┐
                    │  merge → 배포 │
                    └──────────────┘
```

---

## 6. 데이터 품질 체크리스트

새 장소를 추가하기 전 반드시 확인:

- [ ] 좌표가 지도상 실제 위치와 일치하는가?
- [ ] 영업시간은 최신인가? (COVID 이후 변경 많음)
- [ ] 한국인 관련 태그가 1개 이상 있는가?
- [ ] 웹사이트 링크가 유효한가?
- [ ] `lastUpdated`에 날짜가 기록되었는가?
- [ ] 이미지가 placeholder가 아닌가?

---

## 7. 실행 로드맵

| 단계 | 작업 | 비용 | 완료 기준 |
|------|------|------|----------|
| 1 | OSM Overpass로 토론토 베이스 수집 | $0 | 500개 이상 장소 JSON |
| 2 | Google Places 무료 티어로 사진/리뷰 보강 | $0 | 100개 인기 장소 보강 |
| 3 | Foursquare/Yelp로 한인 타운 보강 | $0 | 50개 장소 추가 |
| 4 | 수동 검수 + 태그 정제 | $0 | PR 리뷰 완료 |
| 5 | 자동화 파이프라인 (GitHub Actions) | $0 | 매일 자동 실행 |
| 6 | 밴쿠버/몬트리올 확장 | $0 | 동일 프로세스 반복 |

---

## 9. 구현된 Fetcher 모듈

| 모듈 | 파일 | 무료 한도 | 카드 필요 |
|------|------|----------|----------|
| **OSM** | `src/lib/osmFetcher.ts` | 무제한 | ❌ 없음 |
| **Foursquare** | `src/lib/foursquareFetcher.ts` | 500회/일 | ❌ 없음 |
| **Yelp** | `src/lib/yelpFetcher.ts` | 500회/일 | ❌ 없음 |
| **Google Places** | `src/lib/googlePlacesFetcher.ts` | $200/월 | ✅ 필수 |

### 사용법
```bash
# 1. OSM (키 불필요)
npm run fetch:osm-toronto

# 2. Foursquare (키 필요)
# .env.local에 NEXT_PUBLIC_FSQ_API_KEY 추가 후
# fetchFsqTorontoKorean() 등 호출

# 3. Yelp (키 필요)
# .env.local에 NEXT_PUBLIC_YELP_API_KEY 추가 후
# fetchYelpTorontoKorean() 등 호출

# 4. Google (키 + 카드 필요)
# .env.local에 NEXT_PUBLIC_GOOGLE_PLACES_API_KEY 추가 후
# fetchGoogleTorontoKorean() 등 호출
```

### 권장 우선순위
1. **OSM**으로 베이스 수집 (무료, 무제한)
2. **Foursquare**로 인기 장소 사진/리뷰 보강 (무료 500회/일)
3. **Yelp**로 한인 식당 리뷰 보강 (무료 500회/일)
4. **Google**은 나중에 카드 넣으면 바로 활성화

---

## 8. 참고 링크

- Overpass API: https://overpass-api.de/api/interpreter
- OSM Tag 설명: https://wiki.openstreetmap.org/wiki/Map_features
- Google Places Pricing: https://developers.google.com/maps/documentation/places/web-service/usage-and-billing
- Foursquare Places API: https://location.foursquare.com/developer/reference/places-api-overview
- Yelp Fusion: https://docs.developer.yelp.com/reference/v3_business_search
