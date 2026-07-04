#!/usr/bin/env tsx
/**
 * src/data/places.ts 의 inline GTA 데이터를 별도 파일로 분리
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../src/data");
const PLACES_FILE = path.join(DATA_DIR, "places.ts");

const content = fs.readFileSync(PLACES_FILE, "utf-8");

// places 배열 시작/끝 찾기
const placesDecl = content.indexOf("export const places: Place[] = [");
const arrStart = content.indexOf("[", placesDecl);

// `];` 를 찾되, depth=0 에서
let depth = 0;
let arrEnd = arrStart;
for (let i = arrStart; i < content.length; i++) {
  if (content[i] === "[") depth++;
  else if (content[i] === "]") {
    depth--;
    if (depth === 0) {
      arrEnd = i + 1;
      break;
    }
  }
}

const arrContent = content.substring(arrStart, arrEnd);

// 모든 spread operator (...xxx) 제거하고 순수 객체만 남기기
// Spread 앞뒤를 분리
const beforeArr = content.substring(0, arrStart);
const afterArr = content.substring(arrEnd);

// places.ts 에서는 import + spread만 남기고 객체는 gta-core.ts 로 이동
const gtaCoreContent = `import type { Place } from "./places";

// GTA 핵심 큐레이션 데이터
export const gtaCorePlaces: Place[] = ${arrContent};
`;

// places.ts 재작성 — inline 객체 제거, gta-core.ts import 추가
// 기존 import 문에 gta-core 추가
const importInsert = `import { gtaCorePlaces } from "./gta-core";\n`;
const newBeforeArr = beforeArr.replace(
"import { torontoCollected } from \"./toronto-collected\";",
`import { torontoCollected } from "./toronto-collected";\n${importInsert}`
);

// 배열 내용: gtaCorePlaces spread + 나머지 city spreads
const newArr = `export const places: Place[] = [\n  ...gtaCorePlaces,\n  ...vancouverPlaces,\n  ...montrealPlaces,\n  ...calgaryPlaces,\n  ...edmontonPlaces,\n  ...ottawaPlaces,\n  ...victoriaPlaces,\n  ...winnipegPlaces,\n  ...torontoCollected,\n];`;

const newPlacesContent = newBeforeArr + newArr + afterArr;

fs.writeFileSync(path.join(DATA_DIR, "gta-core.ts"), gtaCoreContent, "utf-8");
fs.writeFileSync(PLACES_FILE, newPlacesContent, "utf-8");

console.log("✅ gta-core.ts 생성 완료");
console.log("✅ places.ts 정리 완료");
