//Article 요청 함수 구현하기
///https://panda-market-api-crud.vercel.app/docs 의 Article API를 이용하여 아래 함수들을 구현해 주세요.

import axios from "axios";
import { Article } from "./main.js";
import { logAndThrow } from "./until.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

/*getArticleList() : GET 메소드를 사용해 주세요.
 * @param {{page: number, pageSize number, keyword: string}} params 쿼리파라미터
 */
export function getArticleList(params) {
  return axios
    .get(BASE_URL, { params })
    .then(({ data }) => data.list.map(Article.of))
    .catch((error) => logAndThrow("getting article list", error));
}

//getArticle() : GET 메소드를 사용해 주세요.
export function getArticle(articleId) {
  return axios
    .get(`${BASE_URL}/${articleId}`)
    .then(Article.of)
    .catch((error) => logAndThrow("getting article", error));
}

/*createArticle() : POST 메소드를 사용해 주세요.
request body에 title, content, image 를 포함해 주세요.
*/
export function createArticle(article) {
  return axios
    .post(BASE_URL, article)
    .catch((error) => logAndThrow("creating article", error));
}

//patchArticle() : PATCH 메소드를 사용해 주세요.
export function patchArticle(id, article) {
  return axios
    .patch(`${BASE_URL}/${id}`, article)
    .catch((error) => logAndThrow("patching article", error));
}

//deleteArticle() : DELETE 메소드를 사용해 주세요.
export function deleteArticle(articleId) {
  return axios
    .delete(`${BASE_URL}/${articleId}`)
    .then(({ id }) => id)
    .catch((error) => logAndThrow("deleting article", error));
}
