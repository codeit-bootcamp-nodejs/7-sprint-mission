// main.js
import axios from "axios";

// API 기본 설정
const API_BASE = "https://your-api-endpoint.com";

// 예시 상품 데이터
const products = [
  {
    id: 1,
    category: "전자제품",
    name: "냉장고",
    price: 120000,
    description: "전자제품",
    tags: ["전자제품"],
    image: "https://www.example.com",
  },
  {
    id: 2,
    category: "일반제품",
    name: "상품 테스트 이름",
    price: 42000,
    description: "string",
    tags: ["전자 테스트 제품"],
    image: "https://example.com/12",
  },
];

// 예시 아티클 데이터
const articles = [
  {
    id: 1,
    title: "Axios로 [제목 수정] 완료!",
    author: "알 수 없음",
    content: "CRUD 테스트용",
    likes: 0,
    createdAt: "알 수 없음",
  },
  {
    id: 2,
    title: "게시글 제목입니다.",
    author: "알 수 없음",
    content: "게시글 내용입니다.",
    likes: 0,
    createdAt: "알 수 없음",
  },
];

// 상품 리스트 출력
function printProducts() {
  console.log("==== 상품 리스트 ====");
  products.forEach((p, i) => {
    console.log(
      `${i + 1}. [${p.category}] ${p.name} - ${p.price.toLocaleString()}원`
    );
    console.log(`   설명: ${p.description}`);
    console.log(`   태그: ${p.tags.join(", ")}`);
    console.log(`   이미지: ${p.image}`);
    console.log("------------------------");
  });
}

// 아티클 리스트 출력
function printArticles() {
  console.log("==== 아티클 테스트 ====");
  articles.forEach((a, i) => {
    console.log(`${i + 1}. [${a.title}] 작성자: ${a.author}`);
    console.log(`   내용: ${a.content}`);
    console.log(`   좋아요: ${a.likes} / 생성일: ${a.createdAt}`);
    console.log("------------------------");
  });
}

// 아티클 생성 예시
async function createArticle(article) {
  try {
    const res = await axios.post(`${API_BASE}/articles`, article);
    console.log("아티클 생성 성공:", res.data);
  } catch (err) {
    console.error(
      `createArticle 실패 (상태 코드: ${err.response?.status}):`,
      err.message
    );
  }
}

// 테스트 실행
async function runTest() {
  printProducts();
  printArticles();

  // 아티클 생성 테스트
  await createArticle({
    title: "새 테스트 글",
    content: "생성 테스트",
    author: "테스터",
  });
}

runTest();

