#!/usr/bin/env tsx
/**
 * Foursquare API 키 디버그 — 여러 포맷 테스트
 */

const API_KEY = process.env.NEXT_PUBLIC_FSQ_API_KEY || "";
const CITY_COORDS = { lat: 43.6532, lng: -79.3832 };

async function testWithHeader(headerName: string, headerValue: string) {
  const params = new URLSearchParams({
    ll: `${CITY_COORDS.lat},${CITY_COORDS.lng}`,
    radius: "15000",
    query: "korean restaurant",
    limit: "5",
  });

  console.log(`\n🔧 테스트: ${headerName} = ${headerValue.slice(0, 20)}...`);
  const res = await fetch(`https://api.foursquare.com/v3/places/search?${params.toString()}`, {
    headers: { [headerName]: headerValue },
  });

  console.log(`   상태: ${res.status} ${res.statusText}`);
  if (res.ok) {
    const data = await res.json();
    console.log(`   결과: ${data.results?.length || 0}개 장소`);
    data.results?.slice(0, 3).forEach((r: any) => console.log(`      · ${r.name}`));
    return true;
  } else {
    const text = await res.text();
    console.log(`   응답: ${text.slice(0, 200)}`);
    return false;
  }
}

async function main() {
  console.log("🔍 Foursquare API 키 포맷 테스트");
  console.log(`키 길이: ${API_KEY.length}자`);

  // Try multiple formats
  const formats = [
    ["Authorization", API_KEY],
    ["Authorization", `Bearer ${API_KEY}`],
    ["Authorization", `FSQ ${API_KEY}`],
  ];

  for (const [name, value] of formats) {
    const ok = await testWithHeader(name, value);
    if (ok) {
      console.log(`\n✅ 성공! 사용할 헤더: ${name}: ${value.slice(0, 30)}...`);
      break;
    }
  }
}

main().catch(console.error);
