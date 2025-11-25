import axios from "axios";
import { Article } from "./main.js";
import { logAndThrow } from "./util.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

export function getArticleList(params) {
  return axios
    .get(BASE_URL, { params })
    .then(({ data: { list: articles } }) => articles.map(Article.of))
    .catch((e) => logAndThrow("getting article list", e));
}

export function getArticle(articleId) {
  return axios
    .get(`${BASE_URL}/${articleId}`)
    .then((response) => response.data)
    .then(Article.of)
    .catch((e) => logAndThrow("gerring article", e));
}

export function createArticle(article) {
  return axios
    .post(BASE_URL, article)
    .catch((e) => logAndThrow("creating article", e));
}

export function patchArticle(articleId, article) {
  return axios
    .patch(`${BASE_URL}/${articleId}`, article)
    .catch((e) => logAndThrow("patching article", e));
}

export function deleteArticle(articleId) {
  return axios
    .delete(`${BASE_URL}/${articleId}`)
    .then(({ id }) => id)
    .catch((e) => logAndThrow("deleting article", e));
}

///// 아래는 테스트 코드 입니다.
// //getArticleList 실행 코드
getArticleList({ page: 2, pageSize: 10 }).then((articleList) =>
  console.log(articleList)
);

//getArticle 함수 실행코드
const testId = 5323;
getArticle(testId).then((getOneArticle) => {
  console.log("Article 조회성공");
  console.log(`-ID: ${testId}, 제목: ${getOneArticle.title}`);
  console.log(getOneArticle);
});

// createArticle 실행 코드
const newArticleData = {
  title: "게시글 제목입니다.",
  content: "내용",
  image: "https://example.com/...",
};

createArticle(newArticleData).then((createResponse) => {
  console.log("Article 생성 성공");
  console.log(`생성된 Article ID: ${createResponse.data.id}`);
  console.log(createResponse);
});

//patchArticle 함수 실행 코드
const patchId = 5323;
const patchUpdate = {
  title: "타이틀 수정 테스트",
};

patchArticle(patchId, patchUpdate).then((patchResponse) => {
  console.log("게시글 수정이 완료되었습니다.");
  console.log(`-ID: ${patchId} 수정완료.`);
  console.log(patchResponse);
});

//deleteArticle 함수 실행 코드
const deleteId = 5323;
deleteArticle(deleteId)
  .then((delArticle) => {
    console.log(`ID: ${deleteId} 게시글 삭제 성공`);
  })
  .catch((error) => {
    console.error(`ID: ${deleteId} 게시글 삭제 실패:`, error);
  });
