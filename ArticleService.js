// ArticleService.js
import axios from "axios";
import { Article } from "./main.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app";

/**
 * 아티클 리스트 조회
 * @param {Object} params { page, pageSize, keyword }
 * @returns {Promise<Article[]>}
 */
export async function getArticleList(params = {}) {
  try {
    const response = await axios.get(`${BASE_URL}/articles`, { params });
    // 응답 구조가 { list: [ {...} ], totalCount: … } 라는 가정
    const articles = response.data.list.map((item) => {
      // 생성일이 있을수도 있고 없을수도 있으므로 기본값 처리
      const article = new Article(
        item.title,
        item.content,
        item.writer || "알 수 없음"
      );
      return article;
    });
    return articles;
  } catch (error) {
    console.error("getArticleList 에러:", error.message);
    throw error;
  }
}

/**
 * 단일 아티클 조회
 * @param {string|number} id
 * @returns {Promise<Article>}
 */
export async function getArticle(id) {
  try {
    const response = await axios.get(`${BASE_URL}/articles/${id}`);
    const { title, content, writer } = response.data;
    const article = new Article(title, content, writer || "알 수 없음");
    return article;
  } catch (error) {
    console.error("getArticle 에러:", error.message);
    throw error;
  }
}

/**
 * 아티클 생성
 * @param {Object} data { title, content, image }
 * @returns {Promise<Article|null>}
 */
export async function createArticle(data) {
  try {
    // 반드시 image 필드를 배열로
    const body = {
      title: data.title,
      content: data.content,
      image: Array.isArray(data.image) ? data.image : [data.image],
    };
    const response = await axios.post(`${BASE_URL}/articles`, body);
    const { title, content, writer } = response.data;
    const article = new Article(title, content, writer || "알 수 없음");
    console.log("createArticle 성공:", response.status);
    return article;
  } catch (error) {
    const status = error.response ? error.response.status : "N/A";
    console.error(`createArticle 실패 (상태 코드: ${status}):`, error.message);
    return null;
  }
}

/**
 * 아티클 수정
 * @param {string|number} id
 * @param {Object} data { title?, content?, image? }
 * @returns {Promise<Article|null>}
 */
export async function patchArticle(id, data) {
  try {
    const body = {};
    if (data.title !== undefined) body.title = data.title;
    if (data.content !== undefined) body.content = data.content;
    if (data.image !== undefined) {
      body.image = Array.isArray(data.image) ? data.image : [data.image];
    }
    const response = await axios.patch(`${BASE_URL}/articles/${id}`, body);
    const { title, content, writer } = response.data;
    const article = new Article(title, content, writer || "알 수 없음");
    console.log("patchArticle 성공:", response.status);
    return article;
  } catch (error) {
    const status = error.response ? error.response.status : "N/A";
    console.error(`patchArticle 실패 (상태 코드: ${status}):`, error.message);
    return null;
  }
}

/**
 * 아티클 삭제
 * @param {string|number} id
 * @returns {Promise<boolean>} 성공하면 true
 */
export async function deleteArticle(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/articles/${id}`);
    console.log("deleteArticle 성공:", response.status);
    return true;
  } catch (error) {
    const status = error.response ? error.response.status : "N/A";
    console.error(`deleteArticle 실패 (상태 코드: ${status}):`, error.message);
    return false;
  }
}

