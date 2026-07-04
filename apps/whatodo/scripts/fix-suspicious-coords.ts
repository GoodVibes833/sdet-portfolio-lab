#!/usr/bin/env tsx
/**
 * Nominatim으로 의심 가는 좌표만 수정
 * 도심 3-20km 사이 + rating>0 인 장소만 대상
 * 딜레이 1.5초 → 약 30분
 */

import * as fs from "fs";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function nominatim(name: string, city: string): Promise<{lat:number;lng:number}|null> {
  const q = encodeURIComponent(`${name}, ${city}`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "WhatodoApp/1.0" } });
    if (!res.ok) return null;
    const data = await res.json() as any[];
    if (!data || !data[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch { return null; }
}

async function fixCity(jsonPath: string, city: string, center: [number, number]) {
  console.log(`\n🔍 ${city}`);
  const places: any[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // 의심 대상: 도심 3-20km 사이 + rating>0 (정확히 맞는 좌표는 0-3km, 명백히 틀린건 이미 제거됨)
  const targets = places
    .filter(p => p.rating > 0)
    .map(p => ({ ...p, dist: haversine(p.lat, p.lng, center[0], center[1]) }))
    .filter(p => p.dist > 3000 && p.dist < 20000)
    .sort((a, b) => b.rating - a.rating);

  console.log(`  의심 대상: ${targets.length}개 / ${places.length}개`);

  let checked = 0;
  let fixed = 0;

  for (const p of targets) {
    await sleep(1500);
    const nom = await nominatim(p.name, city === "toronto" ? "Toronto, ON, Canada" : city);
    checked++;

    if (!nom) { console.log(`  [${checked}] ⚠️ Nominatim 실패: ${p.name}`); continue; }

    const dist = haversine(p.lat, p.lng, nom.lat, nom.lng);
    const distFromCenter = haversine(nom.lat, nom.lng, center[0], center[1]);

    // Nominatim 좌표가 더 도심 가까우면 & 차이가 크면 수정
    if (dist > 500 && distFromCenter < p.dist) {
      const idx = places.findIndex((x: any) => x.id === p.id);
      if (idx >= 0) {
        places[idx].lat = nom.lat;
        places[idx].lng = nom.lng;
        fixed++;
        console.log(`  [${checked}] ✅ FIXED ${p.name} | ${Math.round(p.dist)}m → ${Math.round(distFromCenter)}m`);
      }
    } else {
      console.log(`  [${checked}] ⏭️ SKIP ${p.name} | 차이 ${Math.round(dist)}m | Nominatim ${Math.round(distFromCenter)}m`);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(places));
  console.log(`  💾 ${fixed}개 수정`);
  return { checked, fixed };
}

async function main() {
  const results = [];
  results.push(await fixCity("public/data/toronto.json", "toronto", [43.6532, -79.3832]));
  results.push(await fixCity("public/data/vancouver.json", "vancouver", [49.2827, -123.1207]));
  results.push(await fixCity("public/data/montreal.json", "montreal", [45.5017, -73.5673]));
  results.push(await fixCity("public/data/ottawa.json", "ottawa", [45.4215, -75.6972]));
  results.push(await fixCity("public/data/calgary.json", "calgary", [51.0447, -114.0719]));

  const totalFixed = results.reduce((s, r) => s + r.fixed, 0);
  console.log(`\n🎉 총 ${totalFixed}개 수정 완료`);
}

main().catch(e => { console.error("❌", e); process.exit(1); });
