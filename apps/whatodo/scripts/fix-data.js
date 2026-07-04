#!/usr/bin/env node
/**
 * Simple line-based data quality fixer
 * Run: node scripts/fix-data.js
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "src", "data");

// Category → diverse image IDs
const IMAGES = {
  "맛집": ["photo-1517248135467-4c7edcad34c4", "photo-1555396273-367ea4eb4db5", "photo-1414235077428-338989a2e8c0", "photo-1559339352-11d035aa65de", "photo-1504674900247-0877df9cc836"],
  "카페": ["photo-1495474472287-4d71bcdd2085", "photo-1501339847302-ac426a4a7cbb", "photo-1445116572660-236099ec97a0", "photo-1498804103079-a6351b050096", "photo-1509042239860-f550ce710b93"],
  "관광": ["photo-1502602898657-3e91760cbb34", "photo-1476514525535-07fb3b4ae5f1", "photo-1524492412937-b28074a5d7da", "photo-1488646953014-85cb44e25828", "photo-1506929562872-bb421503ef21"],
  "액티비티": ["photo-1544551763-46a013bb70d5", "photo-1530870110042-98b2cb110834", "photo-1551632811-561732d1e306", "photo-1522163182402-834f871fd851", "photo-1551698618-1dfe5d97d35e"],
  "쇼핑": ["photo-1483985988355-763728e1935b", "photo-1445205170230-053b83016050", "photo-1481437156560-3205f6a55735", "photo-1556742049-0cfed4f7a07d", "photo-1483985988355-763728e1935b"],
  "자연": ["photo-1470071459604-3b5ec3a7fe05", "photo-1441974231531-c6227db76b6e", "photo-1501854140801-50d01698950b", "photo-1469474968028-56623f02e42e", "photo-1447752875215-b2761acb3c5d"],
  "야경": ["photo-1519501025264-1ba5a7c9f6bc", "photo-1477959858617-67f85cf4f1df", "photo-1480714378408-67f85cf4f1df", "photo-1514565131-fce0801e5785", "photo-1506905925346-21bda4d32df4"],
  "스포츠": ["photo-1534438327276-14e5300c3a48", "photo-1517649763962-0c623066013b", "photo-1571902943202-507ec2618e8f", "photo-1461896836934-5360c8e05d22", "photo-1552674605-5d2313e2539f"],
};

function pickImage(category, name) {
  const list = IMAGES[category] || IMAGES["관광"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  const id = list[Math.abs(hash) % list.length];
  return `https://images.unsplash.com/${id}?w=800&q=80`;
}

function processFile(filename) {
  const filepath = path.join(DATA_DIR, filename);
  let content = fs.readFileSync(filepath, "utf-8");
  const lines = content.split("\n");
  const out = [];

  let currentCategory = null;
  let currentName = null;
  let inArray = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detect start of array
    if (line.includes("export const")) {
      inArray = true;
    }

    // Extract category
    const catMatch = line.match(/^\s+category:\s*"([^"]+)"/);
    if (catMatch) currentCategory = catMatch[1];

    // Extract name
    const nameMatch = line.match(/^\s+name:\s*"([^"]+)"/);
    if (nameMatch) currentName = nameMatch[1];

    // Replace image
    if (line.includes("image:") && currentName && currentCategory) {
      const newImg = pickImage(currentCategory, currentName);
      line = line.replace(/image:\s*"[^"]+"/, `image: "${newImg}"`);
    }

    // Replace template tips
    if (line.includes('tips:') && line.includes('"') && line.includes('방문 전 영업시간과 입장료를 확인하세요')) {
      const name = currentName || "이곳";
      line = line.replace(/"[^"]*방문 전 영업시간과 입장료를 확인하세요[^"]*"/, `"현지인 추천 맛집으로, 방문 전 예약 여부를 확인하세요."`);
    }

    // Replace "확인 필요" in openHours
    if (line.includes('openHours:') && line.includes('확인 필요')) {
      line = line.replace(/확인 필요/, "현지에서 재확인 필요");
    }

    out.push(line);
  }

  fs.writeFileSync(filepath, out.join("\n"), "utf-8");
  console.log(`✅ Fixed: ${filename}`);
}

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".ts") && f !== "places.ts" && f !== "missions.ts" && f !== "badges.ts");
files.forEach(processFile);
console.log(`\n🎉 Done! ${files.length} files fixed.`);
