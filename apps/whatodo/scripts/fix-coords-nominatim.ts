#!/usr/bin/env tsx
/**
 * Nominatim (무료 OSM geocoder)로 좌표 검증/수정
 * 랜덤 샘플링 → 거리 차이 >500m면 Nominatim으로 업데이트
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

async function checkAndFix(jsonPath: string, city: string, sampleSize: number, thresholdMeters: number) {
  console.log(`\n🔍 ${city} — ${jsonPath}`);
  const places: any[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // rating 높은 순 우선 샘플
  const withRating = places.filter(p => p.rating > 0).sort((a: any, b: any) => b.rating - a.rating);
  const sample = withRating.slice(0, Math.min(sampleSize, withRating.length));

  console.log(`  샘플: ${sample.length}개 / 전체 ${places.length}개 (rating>0: ${withRating.length}개)`);

  let checked = 0;
  let bad = 0;
  let fixed = 0;
  const fixes: any[] = [];

  for (const p of sample) {
    await sleep(1100); // Nominatim 예의: 1초 간격
    const nom = await nominatim(p.name, city === "toronto" ? "Toronto, ON, Canada" : city);
    checked++;

    if (!nom) { console.log(`  [${checked}] ❌ Nominatim 실패: ${p.name}`); continue; }

    const dist = haversine(p.lat, p.lng, nom.lat, nom.lng);
    const status = dist > thresholdMeters ? "❌ WRONG" : "✅ OK";

    if (dist > thresholdMeters) {
      bad++;
      fixes.push({ id: p.id, name: p.name, old: [p.lat, p.lng], new: [nom.lat, nom.lng], dist: Math.round(dist) });
      // 실제 수정
      const idx = places.findIndex((x: any) => x.id === p.id);
      if (idx >= 0) {
        places[idx].lat = nom.lat;
        places[idx].lng = nom.lng;
        fixed++;
      }
    }

    console.log(`  [${checked}] ${status} ${p.name} | 기존: ${p.lat.toFixed(4)},${p.lng.toFixed(4)} | Nominatim: ${nom.lat.toFixed(4)},${nom.lng.toFixed(4)} | 차이: ${Math.round(dist)}m`);
  }

  if (fixed > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(places));
    console.log(`  💾 ${fixed}개 수정 저장`);
  }

  console.log(`  📊 결과: ${checked}개 검사 | ${bad}개 이상(${thresholdMeters}m+) | ${fixed}개 수정`);
  return { checked, bad, fixed, fixes };
}

async function main() {
  // rating 있는 장소 우선 전체 수정 (실제 노출되는 장소)
  const results = [];
  results.push(await checkAndFix("public/data/toronto.json", "toronto", 300, 300));
  results.push(await checkAndFix("public/data/vancouver.json", "vancouver", 200, 300));
  results.push(await checkAndFix("public/data/montreal.json", "montreal", 100, 300));
  results.push(await checkAndFix("public/data/ottawa.json", "ottawa", 80, 300));
  results.push(await checkAndFix("public/data/calgary.json", "calgary", 80, 300));

  const totalBad = results.reduce((s, r) => s + r.bad, 0);
  const totalFixed = results.reduce((s, r) => s + r.fixed, 0);
  console.log(`\n🎉 전체: ${totalBad}개 불량 발견, ${totalFixed}개 수정`);
}

main().catch(e => { console.error("❌", e); process.exit(1); });
