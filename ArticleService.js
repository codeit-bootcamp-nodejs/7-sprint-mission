import axios from "axios";
import { logAndThrow } from "./util.js";
import { Article } from "./article.js";

// ## Article 요청 함수 구현하기
const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

// 1. getArticleList() : 게시글 목록 가져오기 (GET)
// - page, pageSize, keyword 쿼리 파라미터를 이용
export function getArticleList(params) {
  return (
    axios
      .get(BASE_URL, { params })
      // 응답 데이터에서 articles 배열을 추출하고 Article 클래스 인스턴스로 변환
      .then(({ data: { list: articles } }) => articles.map(Article.of))
      .catch((e) => logAndThrow("getting article list", e))
  );
}

// 2. getArticle() : 특정 게시글 가져오기 (GET)
export function getArticle(articleId) {
  return (
    axios
      .get(`${BASE_URL}/${articleId}`)
      // 단일 응답 데이터를 Article 클래스 인스턴스로 변환
      .then(({ data }) => Article.of(data)) // 구조 분해 할당을 명시적으로 사용하면 더 안전합니다.
      .catch((e) => logAndThrow("getting article", e))
  );
}

// 3. createArticle() : 게시글 생성 (POST)
// - request body에 title, content, image 를 포함
export function createArticle(article) {
  return axios
    .post(BASE_URL, article)
    .catch((e) => logAndThrow("creating article", e));
}

// 4. patchArticle() : 게시글 수정 (PATCH)
export function patchArticle(id, article) {
  return (
    axios
      // 💡 수정됨: articleId 대신 인자로 받은 id 변수를 사용하도록 수정
      .patch(`${BASE_URL}/${id}`, article)
      .catch((e) => logAndThrow("patching article", e))
  );
}

// 5. deleteArticle() : 게시글 삭제 (DELETE)
export function deleteArticle(articleId) {
  return (
    axios
      .delete(`${BASE_URL}/${articleId}`)
      // 응답 객체 전체가 아닌 id만 반환하도록 수정 (API 응답 구조에 따라 다름)
      .then((response) => response.data.id || articleId)
      .catch((e) => logAndThrow("deleting article", e))
  );
}
