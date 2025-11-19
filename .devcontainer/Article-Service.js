import axios from "axios";
import { Article } from "./main";

const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

// API 응답 → Article 객체 변환
export const articleFromInfo = ({ title, content, writer, createdAt }) =>
  new Article(title, content, writer, createdAt);

// 공통 에러 처리
export const logAndThrow = (error) => {
  console.error("Article API Error:", error);
  throw error;
};

// -------------------------
// 1. getArticleList()
// -------------------------
export function getArticleList(params) {
  return axios
    .get(BASE_URL, { params })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        console.error("Request failed:", response.status);
      }
      return response.data.list.map(articleFromInfo);
    })
    .catch(logAndThrow);
}

// -------------------------
// 2. getArticle()
// -------------------------
export function getArticle(articleId) {
  return axios
    .get(`${BASE_URL}/${articleId}`)
    .then((response) => {
      if (response.status !== 200) {
        console.error("Request failed:", response.status);
      }
      return articleFromInfo(response.data);
    })
    .catch(logAndThrow);
}

// -------------------------
// 3. createArticle()
// -------------------------
export function createArticle(article) {
  return axios
    .post(BASE_URL, article)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        console.error("Request failed:", response.status);
      }
      return articleFromInfo(response.data);
    })
    .catch(logAndThrow);
}

// -------------------------
// 4. patchArticle()
// -------------------------
export function patchArticle(articleId, article) {
  return axios
    .patch(`${BASE_URL}/${articleId}`, article)
    .then((response) => {
      if (response.status !== 200) {
        console.error("Request failed:", response.status);
      }
      return articleFromInfo(response.data);
    })
    .catch(logAndThrow);
}

// -------------------------
// 5. deleteArticle()
// -------------------------
export function deleteArticle(articleId) {
  return axios
    .delete(`${BASE_URL}/${articleId}`)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        console.error("Request failed:", response.status);
      }
      return true;
    })
    .catch(logAndThrow);
}
