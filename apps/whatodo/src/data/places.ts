import { vancouverPlaces } from "./vancouver";
import { montrealPlaces } from "./montreal";
import { calgaryPlaces } from "./calgary";
import { edmontonPlaces } from "./edmonton";
import { ottawaPlaces } from "./ottawa";
import { victoriaPlaces } from "./victoria";
import { winnipegPlaces } from "./winnipeg";
import { torontoCollected } from "./toronto-collected";
import { gtaCorePlaces } from "./gta-core";

export type City = "toronto" | "vancouver" | "montreal" | "calgary" | "edmonton" | "ottawa" | "victoria" | "winnipeg";

export type Category =
  | "맛집"
  | "관광"
  | "액티비티"
  | "쇼핑"
  | "자연"
  | "야경"
  | "카페"
  | "스포츠";

export type Neighborhood =
  | "다운타운"
  | "노스욕"
  | "미시사가"
  | "이스트요크"
  | "키치너"
  | "워터프론트"
  | "차이나타운"
  | "켄싱턴"
  | "리틀이탈리"
  | "요크빌"
  | "스카버러"
  | "이튼센터"
  | "스탠리파크"
  | "개스타운"
  | "그랜빌"
  | "키칠라노"
  | "노스밴쿠버"
  | "리치몬드"
  | "플래토"
  | "올드포트"
  | "밀레엔드"
  | "다운타운몬트리올"
  | "생로랑"
  | "다운타운캘거리"
  | "밴프"
  | "재스퍼"
  | "보우밸리"
  | "다운타운에드먼턴"
  | "올드스트라스코나"
  | "웨스트에드"
  | "다운타운오타와"
  | "바이워드마켓"
  | "게이티노"
  | "다운타운빅토리아"
  | "올드타운빅토리아"
  | "다운타운위니펙"
  | "익스체인지디스트릭트"
  | "디스틸러리"
  | "레슬리빌"
  | "트리니티벨우즈"
  | "정션"
  | "리틀포르투갈"
  | "이스트엔드"
  | "리버데일"
  | "블루어웨스트"
  | "하버프론트"
  | "노스욕한인타운"
  | "에토비코"
  | "스카버러한인타운"
  | "미시사가한인타운"
  | "마컴"
  | "버핑턴"
  | "리치몬드힐"
  | "온타리오플레이스"
  | "킹스트릿"
  | "퀸스트릿웨스트"
  | "파이낸셜디스트릭트"
  | "영앤던다스"
  | "미드타운"
  | "이스트욕"
  | "리틀이탈리"
  | "이튼센터"
  | "올드타운"
  | "이스트엔드"
  | "정션"
  | "레슬리빌"
  | "리버데일"
  | "트리니티벨우즈"
  | "처치앤웰즐리"
  | "코리아타운"
  | "에글링턴";

export interface SourceLink {
  label: string;   // "네이버 블로그", "Reddit", "TripAdvisor", "공식사이트" 등
  url: string;
}

export interface Place {
  id: string;
  name: string;
  nameKo?: string;
  nameEn: string;
  city: City;
  category: Category;
  neighborhood: Neighborhood;
  description: string;
  shortDesc: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount?: number;
  _dist?: number;
  priceLevel: 0 | 1 | 2 | 3;
  tags: string[];
  tips: string[];
  openHours?: string;
  phone?: string;
  website?: string;
  officialWebsite?: string;        // 공식 홈페이지 (운영시간·요금 등 반드시 확인 권장)
  bestSeason?: string;             // 예: "6~8월 여름", "연중", "10월 단풍"
  sourceLinks?: SourceLink[];      // 참고 링크 (블로그·레딧·트립어드바이저 등)
  lastUpdated?: string;            // 정보 마지막 확인일 "2025-05"
  image: string;
  featured?: boolean;
  isFree?: boolean;
  indoorOutdoor?: "indoor" | "outdoor" | "both";
  recommendScore?: 1 | 2 | 3 | 4 | 5;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: "교통" | "생활" | "알바" | "음식" | "날씨" | "비용";
  emoji: string;
}

export const cities: { id: City; label: string; emoji: string; description: string; comingSoon?: boolean; koreanPop?: string }[] = [
  { id: "toronto", label: "토론토", emoji: "🏙️", description: "캐나다 최대 도시", koreanPop: "약 10만명" },
  { id: "vancouver", label: "밴쿠버", emoji: "🌊", description: "산과 바다의 도시", koreanPop: "약 8만명" },
  { id: "montreal", label: "몬트리올", emoji: "⚜️", description: "프랑스어권 문화 도시", koreanPop: "약 1만명" },
  { id: "calgary", label: "캘거리", emoji: "🌿", description: "로키산맥·밴프의 관문", koreanPop: "약 2만명" },
  { id: "edmonton", label: "에드먼턴", emoji: "🛢️", description: "앨버타 주도·한인 커뮤니티", koreanPop: "약 1.5만명" },
  { id: "ottawa", label: "오타와", emoji: "🍁", description: "캐나다 수도·무료 국립 박물관", koreanPop: "약 5천명" },
  { id: "victoria", label: "빅토리아", emoji: "🌸", description: "BC주 주도·정원의 도시", koreanPop: "약 3천명" },
  { id: "winnipeg", label: "위니펙", emoji: "🦬", description: "캐나다 중심·프레리의 도시", koreanPop: "약 3천명" },
];

export const places: Place[] = [
  ...gtaCorePlaces,
  ...vancouverPlaces,
  ...montrealPlaces,
  ...calgaryPlaces,
  ...edmontonPlaces,
  ...ottawaPlaces,
  ...victoriaPlaces,
  ...winnipegPlaces,
  ...torontoCollected,
];

export const tips: Tip[] = [
  {
    id: "presto-card",
    title: "프레스토 카드로 교통비 절약",
    content:
      "토론토 대중교통(TTC)은 프레스토(PRESTO) 카드를 사용하면 현금보다 저렴해요. Shoppers Drug Mart나 지하철역에서 구매 가능하고, 앱으로 충전도 돼요. 단일 요금제라 어디를 가도 $3.30 CAD예요. (2시간 내 환승 무료!)",
    category: "교통",
    emoji: "🚇",
  },
  {
    id: "go-train",
    title: "GO Train으로 근교 여행",
    content:
      "유니언 스테이션에서 GO Train을 타면 나이아가라 폭포, 해밀턴, 오샤와 등 근교 도시에 저렴하게 갈 수 있어요. 주말엔 나이아가라 폭포행 특별 요금도 있어요.",
    category: "교통",
    emoji: "🚂",
  },
  {
    id: "kijiji-jobs",
    title: "현금잡 구하기 - Kijiji & Facebook",
    content:
      "워홀러라면 Kijiji.ca와 Facebook 'Toronto Korean Working Holiday' 그룹을 활용하세요. 식당 서버, 이삿짐 도우미, 이벤트 스태프 등 단기 현금 잡을 구하기 좋아요. Craigslist도 활용 가능해요.",
    category: "알바",
    emoji: "💼",
  },
  {
    id: "grocery-tips",
    title: "식비 절약 - 노프릴스 & 코스트코",
    content:
      "No Frills, FreshCo, Food Basics는 저렴한 슈퍼마켓이에요. 코스트코는 회원비 있지만 대용량 식품을 저렴하게 살 수 있어요. 저녁엔 유통기한 임박 식품을 50% 할인 판매해요. T&T는 아시안 마트로 한국 식품도 있어요.",
    category: "음식",
    emoji: "🛒",
  },
  {
    id: "winter-prep",
    title: "토론토 겨울 대비법",
    content:
      "토론토 겨울은 -20°C까지 내려가요. 패딩은 무조건 롱패딩, 핫팩 필수, 실내 돌아다닐 때는 패스 시스템(PATH) 지하 터널을 이용하면 따뜻하게 다닐 수 있어요. 11월~3월은 반드시 방한 완비!",
    category: "날씨",
    emoji: "🧊",
  },
  {
    id: "ohip-health",
    title: "워홀러 의료보험 - OHIP vs 사보험",
    content:
      "캐나다 워홀러는 OHIP(온타리오 건강보험) 혜택을 받을 수 없어요. 반드시 여행자보험 또는 워홀 전용 보험을 들어야 해요. Guard.me, Manulife 등이 워홀러에게 인기 있어요. 병원비가 엄청 비쌉니다!",
    category: "생활",
    emoji: "🏥",
  },
  {
    id: "tipping-culture",
    title: "팁 문화 이해하기",
    content:
      "캐나다는 팁 문화가 강해요. 레스토랑은 보통 15~20%, 바는 1~2달러/잔, 택시/우버는 10~15% 정도예요. 태블릿으로 결제할 때 자동으로 팁 선택이 나오는데, 없음(No Tip) 선택도 가능해요. 테이크아웃은 팁이 필수는 아니에요.",
    category: "생활",
    emoji: "💰",
  },
  {
    id: "toronto-library",
    title: "토론토 공립 도서관 활용법",
    content:
      "Toronto Public Library 카드는 무료로 발급받을 수 있어요. 책, 잡지, 온라인 강의, 심지어 공구까지 빌릴 수 있어요! 와이파이와 컴퓨터도 무료로 사용 가능해서 잠깐 일할 때 카페 대신 도서관을 활용하는 현지인도 많아요.",
    category: "생활",
    emoji: "📚",
  },
  {
    id: "summer-festivals",
    title: "여름 무료 축제 총정리",
    content:
      "토론토 여름엔 무료 축제가 가득해요! Caribana(8월, 카리브해 퍼레이드), Pride Festival(6월), Toronto Jazz Festival(6월), Luminato Festival, NXNE(노스 바이 노스이스트) 등 다양해요. 달력 꼭 챙겨두세요!",
    category: "생활",
    emoji: "🎉",
  },
  {
    id: "cad-exchange",
    title: "환전 꿀팁 - 수수료 최소화",
    content:
      "공항 환전은 수수료가 비싸요. Wise 앱을 사용하면 실시간 환율로 저렴하게 환전 가능해요. 토론토 시내 환전소(특히 Spadina의 환전소들)도 경쟁이 심해서 은행보다 유리해요. 큰 금액 환전 시 꼭 비교해보세요.",
    category: "비용",
    emoji: "💱",
  },
  {
    id: "bank-account",
    title: "캐나다 은행 계좌 개설 - 워홀 첫 주 필수",
    content:
      "캐나다 도착 후 가장 먼저 은행 계좌를 열어야 해요. TD, RBC, Scotiabank, BMO, CIBC 5대 은행 중 TD Bank가 한국어 지원으로 인기 많아요. 여권 + IEC 워킹홀리데이 비자만 있으면 개설 가능! 수수료 없는 청년 플랜(Student/Youth Chequing)을 꼭 물어보세요. 온라인으로 예약 후 방문하면 빨라요.",
    category: "생활",
    emoji: "🏦",
  },
  {
    id: "sim-card",
    title: "캐나다 유심 - 저렴하게 쓰는 법",
    content:
      "공항 유심은 비싸요! 시내 Koodo, Public Mobile, Fido, Freedom Mobile이 저렴해요. 월 $25~35에 데이터 무제한(속도 제한 있음) 플랜이 있어요. Public Mobile은 선불제라 신용카드 없이도 OK. 노스욕 한인타운(Yonge/Finch)에 한국인 운영 대리점이 있어 한국어 상담 가능해요.",
    category: "생활",
    emoji: "📱",
  },
  {
    id: "sin-number",
    title: "SIN 번호 발급 - 알바 전 필수",
    content:
      "SIN(Social Insurance Number)은 캐나다에서 일하려면 반드시 필요해요. Service Canada에 여권 + 비자만 가져가면 당일 발급! 토론토는 Yonge St 지점이 접근성 좋아요. 온라인 예약 필수, 번호 받으면 절대 잃어버리지 마세요. 알바 첫날 고용주에게 줘야 해요.",
    category: "알바",
    emoji: "🪪",
  },
  {
    id: "room-rental",
    title: "자취방 구하기 - 한인 커뮤니티 활용법",
    content:
      "Facebook 'Toronto Korean Working Holiday', '토론토 한인 자취/쉐어' 그룹이 최고예요. Kijiji.ca도 필수. 노스욕(Yonge/Sheppard, Yonge/Finch)은 한인 밀집 지역으로 한인 집주인 매물도 많아요. 월 $800~1200 쉐어룸이 일반적. 처음엔 단기 민박(Airbnb나 한인 민박) 2주 후 방 구하는 전략 추천!",
    category: "생활",
    emoji: "🏠",
  },
  {
    id: "tax-return",
    title: "세금 환급 - 워홀러도 받을 수 있어요",
    content:
      "캐나다에서 세금을 낸 적이 있다면 이듬해 4월 세금 신고를 통해 환급받을 수 있어요. TurboTax, SimpleTax(Wealthsimple Tax) 무료 앱으로 직접 신고 가능. 연 소득 $15,000 이하면 대부분 전액 환급! SIN 번호, T4 서류(고용주에서 받음) 챙겨두세요.",
    category: "비용",
    emoji: "💸",
  },
];

export const categories: { id: Category; label: string; emoji: string; color: string; testId: string }[] = [
  { id: "맛집", label: "맛집", emoji: "🍜", color: "bg-orange-100 text-orange-700", testId: "food" },
  { id: "관광", label: "관광지", emoji: "🏛️", color: "bg-blue-100 text-blue-700", testId: "sight" },
  { id: "액티비티", label: "액티비티", emoji: "🏄", color: "bg-green-100 text-green-700", testId: "activity" },
  { id: "쇼핑", label: "쇼핑", emoji: "🛍️", color: "bg-pink-100 text-pink-700", testId: "shopping" },
  { id: "자연", label: "자연·공원", emoji: "🌿", color: "bg-emerald-100 text-emerald-700", testId: "nature" },
  { id: "야경", label: "야경", emoji: "🌃", color: "bg-purple-100 text-purple-700", testId: "night" },
  { id: "카페", label: "카페", emoji: "☕", color: "bg-amber-100 text-amber-700", testId: "cafe" },
  { id: "스포츠", label: "스포츠", emoji: "⚾", color: "bg-red-100 text-red-700", testId: "sports" },
];

export interface SubCategoryDef {
  id: string;
  parentCategory: Category;
  label: string;
  emoji: string;
  color: string;
  matchTags: string[];
}

export const subCategories: SubCategoryDef[] = [
  // ── 맛집 ────────────────────────────────────────────────────
  { id: "한식", parentCategory: "맛집", label: "한식", emoji: "🥘", color: "bg-red-50 text-red-600",
    matchTags: ["한식", "갈비", "삼겹살", "순두부", "된장", "비빔밥", "국밥", "설렁탕", "불고기", "떡볶이", "김밥", "돈까스", "가정식", "한국음식"] },
  { id: "일식", parentCategory: "맛집", label: "일식", emoji: "🍱", color: "bg-rose-50 text-rose-600",
    matchTags: ["일식", "라멘", "스시", "초밥", "이자카야", "가라아게", "가츠동", "데리야끼", "우동", "타코야끼", "롤"] },
  { id: "아시안", parentCategory: "맛집", label: "아시안", emoji: "🍜", color: "bg-yellow-50 text-yellow-700",
    matchTags: ["태국", "베트남", "중식", "광동", "딤섬", "쌀국수", "포", "팟타이", "인도", "말레이시아", "아시안", "중국", "그린커리", "카레"] },
  { id: "양식", parentCategory: "맛집", label: "양식·버거", emoji: "🍔", color: "bg-amber-50 text-amber-700",
    matchTags: ["피자", "파스타", "스테이크", "버거", "그릭", "이탈리안", "멕시칸", "서양", "양식", "그레이비", "핫도그", "샌드위치"] },
  { id: "해산물", parentCategory: "맛집", label: "해산물", emoji: "🦞", color: "bg-cyan-50 text-cyan-700",
    matchTags: ["해산물", "굴", "랍스터", "크랩", "새우", "피쉬앤칩스", "피시앤칩스", "생선", "seafood"] },
  { id: "브런치카페", parentCategory: "맛집", label: "브런치", emoji: "🥞", color: "bg-orange-50 text-orange-600",
    matchTags: ["브런치", "에그베네딕트", "팬케이크", "와플", "아침식사", "조식"] },

  // ── 관광 ────────────────────────────────────────────────────
  { id: "박물관", parentCategory: "관광", label: "박물관", emoji: "🏺", color: "bg-indigo-50 text-indigo-600",
    matchTags: ["박물관", "museum", "과학관", "공룡", "역사관", "자연사", "IMAX", "4D"] },
  { id: "미술관갤러리", parentCategory: "관광", label: "미술관·갤러리", emoji: "🖼️", color: "bg-violet-50 text-violet-600",
    matchTags: ["미술관", "갤러리", "gallery", "전시", "예술", "아트"] },
  { id: "역사건축", parentCategory: "관광", label: "역사·건축", emoji: "🏰", color: "bg-stone-50 text-stone-600",
    matchTags: ["역사", "건축", "랜드마크", "성", "교회", "유산", "heritage", "historic", "국립"] },
  { id: "전망대", parentCategory: "관광", label: "전망대·루프탑", emoji: "🔭", color: "bg-sky-50 text-sky-600",
    matchTags: ["전망대", "전망", "루프탑", "스카이라인", "CN타워", "꼭대기", "뷰포인트", "산꼭대기"] },
  { id: "테마파크", parentCategory: "관광", label: "테마파크", emoji: "🎡", color: "bg-pink-50 text-pink-600",
    matchTags: ["테마파크", "놀이공원", "놀이기구", "워터파크", "워터슬라이드"] },

  // ── 액티비티 ─────────────────────────────────────────────────
  { id: "야외액티비티", parentCategory: "액티비티", label: "야외·어드벤처", emoji: "🧗", color: "bg-lime-50 text-lime-700",
    matchTags: ["카약", "카누", "래프팅", "집라인", "암벽등반", "자전거", "스쿠버", "스노클링", "서핑", "패러글라이딩", "어드벤처", "야외", "고래관찰"] },
  { id: "실내액티비티", parentCategory: "액티비티", label: "실내·게임", emoji: "🕹️", color: "bg-teal-50 text-teal-600",
    matchTags: ["방탈출", "VR", "볼링", "노래방", "당구", "오락실", "게임", "실내", "드럼", "댄스", "클라이밍"] },
  { id: "투어", parentCategory: "액티비티", label: "투어·크루즈", emoji: "🚌", color: "bg-blue-50 text-blue-600",
    matchTags: ["투어", "크루즈", "도시투어", "나이아가라", "선셋크루즈", "보트", "버스투어", "당일치기"] },
  { id: "문화체험", parentCategory: "액티비티", label: "문화·체험", emoji: "🎭", color: "bg-purple-50 text-purple-600",
    matchTags: ["문화", "문화체험", "K-pop", "공연", "콘서트", "페스티벌", "축제", "체험", "마사지", "스파"] },

  // ── 자연 ─────────────────────────────────────────────────────
  { id: "도심공원", parentCategory: "자연", label: "공원·산책", emoji: "🌳", color: "bg-green-50 text-green-600",
    matchTags: ["공원", "도심공원", "산책", "피크닉", "잔디"] },
  { id: "하이킹", parentCategory: "자연", label: "하이킹·트레일", emoji: "🥾", color: "bg-emerald-50 text-emerald-700",
    matchTags: ["하이킹", "트레일", "등산", "trail", "산", "로키", "밴프"] },
  { id: "해변호수", parentCategory: "자연", label: "해변·호수", emoji: "🏖️", color: "bg-cyan-50 text-cyan-600",
    matchTags: ["해변", "비치", "호수", "강변", "바다", "워터프론트", "Waterfront"] },
  { id: "동물원정원", parentCategory: "자연", label: "동물원·정원", emoji: "🌸", color: "bg-pink-50 text-pink-600",
    matchTags: ["동물원", "정원", "꽃밭", "꽃정원", "식물원", "나비", "동물", "농장", "도시농장"] },

  // ── 쇼핑 ─────────────────────────────────────────────────────
  { id: "쇼핑몰", parentCategory: "쇼핑", label: "쇼핑몰·아울렛", emoji: "🏬", color: "bg-pink-50 text-pink-600",
    matchTags: ["몰", "쇼핑몰", "아울렛", "이튼센터", "마켓플레이스"] },
  { id: "마켓", parentCategory: "쇼핑", label: "마켓·식재료", emoji: "🛒", color: "bg-orange-50 text-orange-600",
    matchTags: ["시장", "마켓", "식재료", "슈퍼마켓", "아시안마트", "푸드마켓", "파머스마켓", "즉석식품"] },
  { id: "빈티지편집샵", parentCategory: "쇼핑", label: "빈티지·편집샵", emoji: "🧥", color: "bg-stone-50 text-stone-600",
    matchTags: ["빈티지", "중고의류", "편집샵", "레트로", "스트릿", "인디", "로컬브랜드"] },
  { id: "캐나다브랜드", parentCategory: "쇼핑", label: "캐나다 브랜드", emoji: "🍁", color: "bg-red-50 text-red-600",
    matchTags: ["캐나다브랜드", "캐나다구스", "룰루레몬", "루루레몬", "로컬", "캐나다"] },

  // ── 야경 ─────────────────────────────────────────────────────
  { id: "루프탑바", parentCategory: "야경", label: "루프탑·바", emoji: "🍸", color: "bg-violet-50 text-violet-600",
    matchTags: ["루프탑", "바", "칵테일", "스카이바", "루프탑바"] },
  { id: "야경뷰포인트", parentCategory: "야경", label: "야경 뷰포인트", emoji: "🌉", color: "bg-indigo-50 text-indigo-600",
    matchTags: ["야경", "야간", "뷰포인트", "야간뷰", "노을", "일몰", "스카이라인"] },

  // ── 카페 ─────────────────────────────────────────────────────
  { id: "스페셜티카페", parentCategory: "카페", label: "스페셜티·핸드드립", emoji: "☕", color: "bg-amber-50 text-amber-700",
    matchTags: ["스페셜티", "핸드드립", "싱글오리진", "에스프레소", "바리스타"] },
  { id: "디저트카페", parentCategory: "카페", label: "디저트·베이커리", emoji: "🧁", color: "bg-rose-50 text-rose-500",
    matchTags: ["디저트", "베이커리", "케이크", "마카롱", "타르트", "빵집", "페이스트리", "크루아상"] },
  { id: "테마카페", parentCategory: "카페", label: "테마·인스타", emoji: "📸", color: "bg-fuchsia-50 text-fuchsia-600",
    matchTags: ["인스타", "포토스팟", "테마카페", "예쁜카페", "인테리어", "감성"] },

  // ── 스포츠 ───────────────────────────────────────────────────
  { id: "스포츠직관", parentCategory: "스포츠", label: "스포츠 직관", emoji: "🏟️", color: "bg-red-50 text-red-600",
    matchTags: ["직관", "스포츠직관", "NBA", "NHL", "MLB", "MLS", "농구", "아이스하키", "야구", "축구"] },
  { id: "겨울스포츠", parentCategory: "스포츠", label: "겨울 스포츠", emoji: "⛷️", color: "bg-sky-50 text-sky-600",
    matchTags: ["동계스포츠", "스키", "스노보드", "컬링", "아이스스케이팅", "겨울"] },
];

export function matchesSubCategory(place: Place, subCatId: string): boolean {
  const sub = subCategories.find((s) => s.id === subCatId);
  if (!sub) return false;
  return place.tags.some((tag) =>
    sub.matchTags.some((mt) => tag.toLowerCase().includes(mt.toLowerCase()))
  );
}

export function getSubCategories(categoryId: Category): SubCategoryDef[] {
  return subCategories.filter((s) => s.parentCategory === categoryId);
}
