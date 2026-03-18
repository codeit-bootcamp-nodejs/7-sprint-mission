import axios from "axios";
import { Article } from "./main.js";

// ## Article 요청 함수 구현하기

// - [https://panda-market-api-crud.vercel.app/docs](https://panda-market-api-crud.vercel.app/docs) 의 Article API를 이용하여 아래 함수들을 구현해 주세요.

//     - `getArticleList()` : GET 메소드를 사용해 주세요.
//         - `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용해 주세요.

const logAndThrow = (error) => {
  console.error("Error fetching article list:", error);
  throw error;
};

function getArticleList(params) {
  return axios
    .get("https://panda-market-api-crud.vercel.app/articles", { params })
    .then((response) => response.data.list.map(articleFromInfo))
    .catch(logAndThrow);
}

//     - `getArticle()` : GET 메소드를 사용해 주세요.
function getArticle(articleId) {
  return axios
    .get(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
    .then(articleFromInfo)
    .catch(logAndThrow);
}

const articleFromInfo = ({ title, content, image }) =>
  new Article(title, content, image);

//     - `createArticle()` : POST 메소드를 사용해 주세요.
//         - request body에 `title`, `content`, `image` 를 포함해 주세요.
function createArticle(article) {
  return axios
    .post("https://panda-market-api-crud.vercel.app/articles", article)
    .catch(logAndThrow);
}

//     - `patchArticle()` : PATCH 메소드를 사용해 주세요.
function patchArticle(id, article) {
  return axios
    .patch(
      `https://panda-market-api-crud.vercel.app/articles/${articleId}`,
      article
    )
    .catch(logAndThrow);
}

//     - `deleteArticle()` : DELETE 메소드를 사용해 주세요.
function deleteArticle(articleId) {
  return axios
    .delete(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
    .then(({ id }) => id)
    .catch(logAndThrow);
}

// - `fetch` 혹은 `axios`를 이용해 주세요.
//     - 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
// - `.then()` 메소드를 이용하여 비동기 처리를 해주세요.
// - `.catch()` 를 이용하여 오류 처리를 해주세요.

// ### Article 요청 함수 구현하기 (심화)

// - Article 클래스에 `createdAt`(생성일자) 프로퍼티를 만들어 주세요.
//     - 새로운 객체가 생성되어 constructor가 호출될 시 `createdAt`에 현재 시간을 저장합니다.
