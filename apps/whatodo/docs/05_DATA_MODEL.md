# 데이터 모델 & 상태 관리

## 장소 데이터 (Place)

```typescript
interface Place {
  id: string;               // 고유 ID (도시-순번)
  name: string;             // 표시 이름
  category: Category;       // 맛집 | 관광 | 액티비티 | ...
  lat: number;              // 위도
  lng: number;              // 경도
  address?: string;           // 주소
  phone?: string;           // 전화번호
  rating?: number;          // 평점 (0~5)
  image: string;            // 대표 이미지 URL
  shortDesc: string;        // 한줄 설명
  description?: string;     // 상세 설명
  hours?: string;           // 영업시간
  tags?: string[];          // 시스템 태그
  neighborhoods?: Neighborhood[];
}
```

### 데이터 현황

| 도시 | 장소 수 | 파일 |
|------|--------|------|
| 토론토 | 60+ | `toronto-collected.ts` |
| GTA 코어 | 20+ | `gta-core.ts` |
| 밴쿠버 | 20+ | `vancouver.ts` |
| 몬트리올 | 20+ | `montreal.ts` |
| 캘거리 | 15+ | `calgary.ts` |
| 에드먼턴 | 15+ | `edmonton.ts` |
| 오타와 | 15+ | `ottawa.ts` |
| 빅토리아 | 15+ | `victoria.ts` |
| 위니펙 | 15+ | `winnipeg.ts` |
| **합계** | **195+** | — |

## 사용자 상태 (localStorage)

```typescript
interface UserState {
  favorites: string[];                    // 찜한 장소 IDs
  visited: { id: string; timestamp: number }[];
  reviews: Record<string, string>;        // placeId → reviewText
  tags: Record<string, string[]>;          // placeId → userTags
  memos: Record<string, string>;          // placeId → memoText
  collections: { id: string; name: string; placeIds: string[] }[];
  filterPresets: { name: string; filters: FilterState }[];
  gamification: {
    points: number;
    level: number;
    badges: string[];
    lastSpinDate: string;
  };
}
```

## 게이미피케이션 상태

```typescript
interface GamificationState {
  points: number;       // 총 포인트
  level: number;        // 현재 레벨 (1~10)
  badges: string[];     // 획득 배지 IDs
  spinCount: number;    // 오늘 룰렛 횟수
  lastSpinDate: string; // 마지막 룰렛 날짜
}

const LEVEL_THRESHOLDS = [0, 50, 120, 250, 450, 700, 1000, 1400, 1900, 2500];

const BADGES = [
  { id: "first_visit",   name: "첫 방문자",   condition: "visited >= 1" },
  { id: "explorer_10",   name: "탐험가",      condition: "visited >= 10" },
  { id: "reviewer",      name: "리뷰어",      condition: "reviews >= 1" },
  { id: "collector",     name: "수집가",      condition: "collections >= 1" },
  { id: "social",        name: "소셜러",      condition: "shared >= 1" },
  { id: "master",        name: "마스터",      condition: "visited >= 50" },
];
```

---
*버전 1.0 | 2026-05-14*
