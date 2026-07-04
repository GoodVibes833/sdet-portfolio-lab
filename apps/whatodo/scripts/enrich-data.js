/**
 * Data enrichment script
 * - Assigns category-appropriate Unsplash images
 * - Improves description templates
 * - Normalizes addresses
 *
 * Usage: node scripts/enrich-data.js
 */

const fs = require("fs");
const path = require("path");

// Category → [Unsplash photo IDs]
const CATEGORY_IMAGES = {
  "맛집": [
    "photo-1517248135467-4c7edcad34c4",
    "photo-1555396273-367ea4eb4db5",
    "photo-1414235077428-338989a2e8c0",
    "photo-1559339352-11d035aa65de",
  ],
  "카페": [
    "photo-1495474472287-4d71bcdd2085",
    "photo-1501339847302-ac426a4a7cbb",
    "photo-1445116572660-236099ec97a0",
    "photo-1498804103079-a6351b050096",
  ],
  "관광": [
    "photo-1502602898657-3e91760cbb34",
    "photo-1476514525535-07fb3b4ae5f1",
    "photo-1524492412937-b28074a5d7da",
    "photo-1488646953014-85cb44e25828",
  ],
  "액티비티": [
    "photo-1544551763-46a013bb70d5",
    "photo-1530870110042-98b2cb110834",
    "photo-1551632811-561732d1e306",
    "photo-1522163182402-834f871fd851",
  ],
  "쇼핑": [
    "photo-1483985988355-763728e1935b",
    "photo-1445205170230-053b83016050",
    "photo-1481437156560-3205f6a55735",
    "photo-1556742049-0cfed4f7a07d",
  ],
  "자연": [
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e",
    "photo-1501854140801-50d01698950b",
    "photo-1469474968028-56623f02e42e",
  ],
  "야경": [
    "photo-1519501025264-1ba5a7c9f6bc",
    "photo-1477959858617-67f85cf4f1df",
    "photo-1480714378408-67cf0d13bc1b",
    "photo-1514565131-fce0801e5785",
  ],
  "스포츠": [
    "photo-1534438327276-14e5300c3a48",
    "photo-1517649763962-0c623066013b",
    "photo-1461896836934- voices", // invalid, will skip
    "photo-1571902943202-507ec2618e8f",
  ],
};

// Pick deterministic image from list based on place name
function pickImage(category, name) {
  const list = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["관광"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const id = list[Math.abs(hash) % list.length];
  return `https://images.unsplash.com/${id}?w=800&q=80`;
}

// Improved description templates by category
const DESC_TEMPLATES = {
  "맛집": [
    "{name}는 현지인들도 자주 찾는 맛집으로, 풍부한 맛과 정성스러운 서비스로 입소문이 자자합니다.",
    "{name}는 캐나다 현지의 맛을 제대로 느낄 수 있는 곳으로, 방문객들의 만족도가 높은 식당입니다.",
    "{name}는 독특한 메뉴 구성과 아늑한 분위기로 한국인 여행자들에게도 인기가 많은 음식점입니다.",
  ],
  "카페": [
    "{name}는 향긋한 커피와 편안한 인테리어로 잠시 쉬어가기 좋은 카페입니다.",
    "{name}는 현지인들의 힐링 공간으로, 디저트와 음료가 모두 훌륭합니다.",
    "{name}는 분위기 좋은 인테리어와 맛있는 베이커리로 SNS에서도 화제인 곳입니다.",
  ],
  "관광": [
    "{name}는 캐나다의 대표적인 볼거리로, 사진 명소이자 현지 문화를 느낄 수 있는 장소입니다.",
    "{name}는 방문객들에게 잊지 못할 추억을 선사하는 유명 관광지입니다.",
    "{name}는 역사와 현대가 어우러진 매력적인 명소로 가볼 만한 곳입니다.",
  ],
  "액티비티": [
    "{name}는 활동적인 여행자에게 추천하는 곳으로, 특별한 경험을 할 수 있습니다.",
    "{name}는 현지인들도 즐기는 인기 액티비티로 추억을 쌓기에 좋습니다.",
    "{name}는 짜릿한 즐거움과 함께 캐나다의 자연을 만끽할 수 있는 장소입니다.",
  ],
  "쇼핑": [
    "{name}는 현지 감성을 담은 다양한 상품들로 가득한 쇼핑 명소입니다.",
    "{name}는 기념품부터 일상용품까지 한번에 둘러볼 수 있는 인기 쇼핑지입니다.",
    "{name}는 트렌디한 분위기와 알찬 구성으로 쇼핑의 즐거움을 더해줍니다.",
  ],
  "자연": [
    "{name}는 맑은 공기와 아름다운 풍경으로 도심의 피로를 풀기 좋은 자연 명소입니다.",
    "{name}는 사계절 각기 다른 매력을 지닌 곳으로 힐링을 원하는 이들에게 안성맞춤입니다.",
    "{name}는 웅장한 자연의 모습과 함께 여유로운 시간을 보낼 수 있는 공간입니다.",
  ],
  "야경": [
    "{name}는 어두워지면 펼쳐지는 화려한 불빛이 매력적인 야경 명소입니다.",
    "{name}는 밤하늘과 도시의 조명이 어우러져 낭만적인 분위기를 자아냅니다.",
    "{name}는 저녁 산책 코스로도 손색없는 곳으로 야경 감상에 최적입니다.",
  ],
  "스포츠": [
    "{name}는 스포츠 애호가들에게 추천하는 곳으로 활기찬 에너지를 느낄 수 있습니다.",
    "{name}는 현지인들의 열정이 가득한 스포츠 명소입니다.",
    "{name}는 다양한 스포츠 시설과 프로그램을 갖춘 인기 장소입니다.",
  ],
};

function pickDesc(category, name) {
  const list = DESC_TEMPLATES[category] || DESC_TEMPLATES["관광"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const tmpl = list[Math.abs(hash) % list.length];
  return tmpl.replace(/{name}/g, name);
}

function pickShortDesc(category, name, city) {
  const cityNames = { toronto: "토론토", vancouver: "밴쿠버", montreal: "몬트리올", calgary: "캘거리", edmonton: "에드먼턴", ottawa: "오타와", victoria: "빅토리아", winnipeg: "위니펙", "gta-core": "GTA" };
  const cityName = cityNames[city] || city;
  const map = {
    "맛집": `${cityName} 대표 맛집`,
    "카페": `${cityName} 힐링 카페`,
    "관광": `${cityName} 필수 관광지`,
    "액티비티": `${cityName} 인기 액티비티`,
    "쇼핑": `${cityName} 쇼핑 명소`,
    "자연": `${cityName} 자연 명소`,
    "야경": `${cityName} 야경 명소`,
    "스포츠": `${cityName} 스포츠 명소`,
  };
  return map[category] || `${cityName} 핫플레이스`;
}

function improveAddress(name, city) {
  const cityNames = { toronto: "Toronto", vancouver: "Vancouver", montreal: "Montreal", calgary: "Calgary", edmonton: "Edmonton", ottawa: "Ottawa", victoria: "Victoria", winnipeg: "Winnipeg", "gta-core": "GTA" };
  const cityName = cityNames[city] || city;
  return `${name}, ${cityName}, Canada`;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const cityMatch = content.match(/city:\s*"([^"]+)"/);
  const city = cityMatch ? cityMatch[1] : "unknown";

  // Parse all place objects in the array
  const newContent = content.replace(
    /(\{\s*id:[\s\S]*?image:\s*")[^"]+(",\s*\})/g,
    (match) => {
      // Extract fields
      const idMatch = match.match(/id:\s*"([^"]+)"/);
      const nameMatch = match.match(/name:\s*"([^"]+)"/);
      const catMatch = match.match(/category:\s*"([^"]+)"/);

      if (!idMatch || !nameMatch || !catMatch) return match;

      const id = idMatch[1];
      const name = nameMatch[1];
      const category = catMatch[1];

      // Replace image
      let result = match.replace(
        /image:\s*"[^"]+"/,
        `image: "${pickImage(category, name)}"`
      );

      // Replace description
      const newDesc = pickDesc(category, name);
      result = result.replace(
        /description:\s*"[^"]+"/,
        `description: "${newDesc}"`
      );

      // Replace shortDesc
      result = result.replace(
        /shortDesc:\s*"[^"]+"/,
        `shortDesc: "${pickShortDesc(category, name, city)}"`
      );

      // Replace address
      result = result.replace(
        /address:\s*"[^"]+"/,
        `address: "${improveAddress(name, city)}"`
      );

      // Replace tips template
      result = result.replace(
        /tips:\s*\["[^"]+"\]/,
        `tips: ["${name} 방문 전 영업시간과 입장료를 확인하세요."]`
      );

      return result;
    }
  );

  fs.writeFileSync(filePath, newContent, "utf-8");
  console.log(`✅ Enriched: ${path.basename(filePath)}`);
}

const dataDir = path.join(__dirname, "..", "src", "data");
const files = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".ts") && f !== "places.ts")
  .map((f) => path.join(dataDir, f));

files.forEach(processFile);
console.log(`\n🎉 Done! ${files.length} files enriched.`);
