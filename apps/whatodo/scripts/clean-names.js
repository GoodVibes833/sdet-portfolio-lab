const fs = require('fs');

const filePath = 'src/data/collected-places.ts';
let text = fs.readFileSync(filePath, 'utf8');

// camelCase → 띄어쓰기 (한글/영문 혼용)
function splitCamel(str) {
  // 영어 camelCase: PrototypeCoffee → Prototype Coffee
  let s = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  // 한글 자음/모음 분리된 경우 복원
  s = s.replace(/([가-힣])([가-힣])/g, '$1$2');
  return s.trim();
}

// id에서 slug 추출 → 상호명 후보
function extractNameFromId(id) {
  const m = id.match(/^\w+-(.+)-\d+$/);
  if (!m) return null;
  return splitCamel(m[1]);
}

// address에서 상호명 추출
function extractNameFromAddress(addr) {
  const m = addr.match(/^(.+?),\s*(?:toronto|vancouver|montreal|calgary|edmonton|ottawa|victoria|winnipeg)/i);
  return m ? m[1].trim() : null;
}

// name이 이상한 제목인지 판별
function isBadName(name) {
  if (!name) return true;
  // 날짜 패턴
  if (/^\d{2}[.\/\-]\d{2}[.\/\-]\d{2}/.test(name)) return true;
  // 의미없는 일반 제목
  const bad = ['가볼만한곳', '최고의', '아름다운을가진', '어학연수', '팩토리아울렛에서', '국제보트쇼', '과 그리고 놀이터', '홀리 척 맛도 분위기도 엄지 척'];
  if (bad.some(b => name.includes(b))) return true;
  if (name.length > 20 && !name.includes(' ') && /[가-힣]/.test(name)) return true; // 한글 긴 연결문자
  return false;
}

let fixed = 0;
let removed = 0;

// object 단위로 파싱
const newObjects = [];
const regex = /\{\s*id:\s*"([^"]+)"[\s\S]*?\},?/g;
let match;

while ((match = regex.exec(text)) !== null) {
  const block = match[0];
  const id = match[1];
  
  // city 추출
  const cityMatch = block.match(/city:\s*"(\w+)"/);
  const city = cityMatch ? cityMatch[1] : '';
  
  // 현재 name 추출
  const nameMatch = block.match(/name:\s*"([^"]*)"/);
  const currentName = nameMatch ? nameMatch[1] : '';
  
  // address 추출
  const addrMatch = block.match(/address:\s*"([^"]*)"/);
  const address = addrMatch ? addrMatch[1] : '';
  
  // category 추출
  const catMatch = block.match(/category:\s*"([^"]*)"/);
  const category = catMatch ? catMatch[1] : '장소';
  
  // id에서 이름 추출
  const idName = extractNameFromId(id);
  const addrName = extractNameFromAddress(address);
  
  // 최적의 이름 선택
  let bestName = currentName;
  if (isBadName(currentName)) {
    if (addrName && !isBadName(addrName)) {
      bestName = addrName;
    } else if (idName && !isBadName(idName)) {
      bestName = idName;
    }
  }
  
  // 완전히 구제불능인 항목은 제거
  if (isBadName(bestName) || bestName.length < 2) {
    removed++;
    continue;
  }
  
  let newBlock = block;
  
  // name 교체
  if (bestName !== currentName) {
    newBlock = newBlock.replace(
      /name:\s*"[^"]*"/,
      `name: "${bestName}"`
    );
    newBlock = newBlock.replace(
      /nameEn:\s*"[^"]*"/,
      `nameEn: "${bestName}"`
    );
    fixed++;
  }
  
  // description 정제
  const newDesc = `${bestName}은(는) ${city === 'toronto' ? '토론토' : city === 'vancouver' ? '밴쿠버' : city}에서 인기 있는 ${category}입니다.`;
  newBlock = newBlock.replace(
    /description:\s*"[^"]*"/,
    `description: "${newDesc}"`
  );
  
  // shortDesc 정제
  const newShort = `${city === 'toronto' ? '토론토' : city === 'vancouver' ? '밴쿠버' : city} 인기 ${category}`;
  newBlock = newBlock.replace(
    /shortDesc:\s*"[^"]*"/,
    `shortDesc: "${newShort}"`
  );
  
  newObjects.push(newBlock);
}

// 파일 재조립
const header = text.substring(0, text.indexOf('([') + 2);
const footer = text.substring(text.lastIndexOf('])'));

const output = header + '\n  ' + newObjects.join('\n  ') + '\n' + footer;
fs.writeFileSync(filePath, output);

console.log(`✅ ${fixed}개 이름 정제 완료`);
console.log(`🗑️ ${removed}개 불량 데이터 제거`);
console.log(`📁 남은 데이터: ${newObjects.length}개`);
