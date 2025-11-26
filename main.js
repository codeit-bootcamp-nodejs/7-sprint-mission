import axios from "axios";
import * as ArticleAPI from "./ArticleService.js";
import * as ProductAPI from "./ProductService.js";

// 공통 요청 함수
export const axiosRequest = async (method, url, data = null, successMsg = "", errorMsg = "") => {
  const API_URL = `https://panda-market-api-crud.vercel.app`;

  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
    });

    console.log(`${successMsg} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${errorMsg} error:`, error.response?.data || error.message);
    return error.response?.data || { error: error.message };
  }
};

// 클래스 정의
class Product {
  #favoriteCount;

  constructor({ name, description, price, tags, images }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.#favoriteCount = 0;
  }

  favorite() {
    this.#favoriteCount++;
  }

  getFavoriteCount() {
    return this.#favoriteCount;
  }
}

class ElectronicProduct extends Product {
  constructor({ name, description, price, tags, images, manufacturer = "미상" }) {
    super({ name, description, price, tags, images });
    this.manufacturer = manufacturer;
  }
}

class Article {
  #likeCount;

  constructor({ title, content, writer, likeCount = 0, createdAt = null }) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.#likeCount = likeCount;
    this.createdAt = createdAt || new Date().toLocaleString();
  }

  like() {
    this.#likeCount++;
  }

  getLikeCount() {
    return this.#likeCount;
  }
}

// --- ProductService 테스트 ---
const testProductApis = async () => {
  // 생성
  const product = await ProductAPI.createProduct({
    images: ["https://example.com/..."],
    tags: ["전자제품"],
    price: 1000000,
    description: "string",
    name: "TV",
  });

  // 조회
  ProductAPI.getProduct(product.id);

  // 리스트 조회
  ProductAPI.getProductList({
    page: 1,
    pageSize: 10,
    orderBy: "recent",
    keyword: "TV",
  });
};

// --- ArticleService 테스트 ---
const testArticleProductApis = async () => {
  // 생성
  const article = await ArticleAPI.createArticle({
    image: "https://example.com/...",
    content: "게시글 내용입니다.",
    title: "게시글 제목입니다.",
  });

  // 조회
  ArticleAPI.getArticle(article.id);

  // 리스트 조회
  ArticleAPI.getArticleList({
    page: 1,
    pageSize: 10,
    orderBy: "recent",
  });
};

testProductApis();
testArticleProductApis();
