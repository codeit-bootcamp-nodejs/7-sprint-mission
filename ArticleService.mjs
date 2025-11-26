export class Article {
  #likeCount;
  constructor(title, content, image, likeCount) {
    this.title = title;
    this.content = content;
    this.image = image;
    this.#likeCount = likeCount;
    this.createdAt = new Date();
  }
  like() {
    this.#likeCount++;
  }
}

import axios from "axios";
import pkg from "lodash";
const { update } = pkg;

const BASE_URL = "https://panda-market-api-crud.vercel.app";

//서버에서 받은 데이터를 데이터 (객체)로 변환(매핑)하기 위해 존재합니다.
const articleInfo = ({ page, pageSize, keyword, orderBy }) =>
  new Article(page, pageSize, keyword, orderBy);

export function getArticleList(params) {
  const url = `${BASE_URL}/articles`;
  return axios
    .get(url, { params })
    .then((response) => {
      console.log(response);
      return response.data.list.map(articleInfo);
    })
    .catch((error) => {
      console.error(`List Error`, error.message);
      throw error;
    });
}

export function getArticle(id) {
  const url = `${BASE_URL}/articles`;
  return axios
    .get(url)
    .then(articleInfo)
    .catch((error) => {
      console.error(`get Error`, error.message);
      throw error;
    });
}
const articleData = {
  image: "https://example.com/...",
  title: "새로운 글 제목",
  content: "글 내용입니다.",
};

export function createArticle(article) {
  const url = `${BASE_URL}/articles`;
  return axios
    .post(url, article)
    .then((response) => {
      console.log("성공!!:", response.data);
    })
    .catch((error) => {
      console.error(`create Error`, error.message);
      throw error;
    });
}
const targetId = 5305;
const updateData = {
  image: "https://new-image.com/...",
  content: "수정된 게시글 내용입니다.",
  title: "수정된 게시글 제목입니다.",
};
export function patchArticle(id, article) {
  const url = `${BASE_URL}/articles/${id}`;
  return axios.patch(url, article).catch((error) => {
    console.error(`patch Error`, error.message);
    throw error;
  });
}

export function deleteArticle(id) {
  const url = `${BASE_URL}/articles/${id}`;
  return axios
    .delete(url)
    .then(() => id)
    .catch((error) => {
      console.error(`delete Error`, error.message);
      throw error;
    });
  }
