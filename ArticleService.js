import axios from "axios";
import { logAndThrow } from "./util.js";
import { Article } from "./article.js";

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
    .then(({ data }) => Article.of(data))
    .catch((e) => logAndThrow("getting article", e));
}

export function createArticle(article) {
  return axios
    .post(BASE_URL, article)
    .catch((e) => logAndThrow("creating article", e));
}

export function patchArticle(id, article) {
  return axios
    .patch(`${BASE_URL}/${id}`, article)
    .catch((e) => logAndThrow("patching article", e));
}

export function deleteArticle(articleId) {
  return axios
    .delete(`${BASE_URL}/${articleId}`)
    .then((response) => response.data.id || articleId)
    .catch((e) => logAndThrow("deleting article", e));
}
