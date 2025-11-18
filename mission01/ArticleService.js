import axios from "axios";
import { Article } from "./main.js";

const BASIC_URL = "https://panda-market-api-crud.vercel.app";

/**
 * @param { object } params - 쿼리 파라미터 { page, pageSize, keyword }
 */
function getArticleList(params = {}) {
  return axios
    .get(`${BASIC_URL}/articles`, { params })
    .then((response) => response.data.list.map(ofArticle))
    .catch((error) => {
      console.error("getArticleList Error", error);
      throw error;
    });
}

function getArticle(articleId) {
  return axios
    .get(`${BASIC_URL}/articles/${articleId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("getArticle Error", error);
      throw error;
    });
}

/**
 * @param { object } params - 쿼리 파라미터 { title, content, image }
 */
function createArticle(params = {}) {
  return axios
    .post(`${BASIC_URL}/articles`, params)
    .then((response) => ofArticle(response.data))
    .then(console.log)
    .catch((error) => {
      console.error("createArticle Error", error);
      throw error;
    });
}

/**
 * @param { object } params - 쿼리 파라미터 { title, content, image }
 */
function patchArticle(articleId, params = {}) {
  //수정 전 데이터 출력
  Promise.resolve(getArticle(articleId)).then((response) =>
    console.log("수정 전:", response)
  );

  return axios
    .patch(`${BASIC_URL}/articles/${articleId}`, params)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("patchArticle Error", error);
      throw error;
    });
}

function deleteArticle(articleId) {
  Promise.resolve(getArticle(articleId)).then((response) =>
    console.log("삭제 전:", response)
  );
  return axios.delete(`${BASIC_URL}/articles/${articleId}`).catch((error) => {
    console.error("deleteArticle Error", error);
    throw error;
  });
}

function ofArticle({ title, content, image, createdAt }) {
  return new Article(title, content, image, createdAt);
}

//Promise.resolve(getArticle(536)).then(console.log);
//deleteArticle(536);

// const patchArti = patchArticle(546, {
//   title: "수정 되나?",
//   content: "정말 되나?",
//   image: "https://ehlsk.com",
// });
// Promise.resolve(patchArti).then(console.log);

// const createArti = createArticle({
//   title: "되나?",
//   content: "정말 되나?",
//   image: "https://ehlsk.com",
// });

// Promise.resolve(createArti).then(console.log);

//Promise.resolve(getArticleList({page:1, pageSize:3, keyword: "되나?"})).then(console.log);
