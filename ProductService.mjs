export class Product {
  #favoriteCount;
  constructor(name, description, price, tags = [], images = [], favoriteCount) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }
  favorite() {
    this.#favoriteCount++;
  }
}

export class ElectronicProduct extends Product {
  constructor(name, description, price, tags = [], images = [], favoriteCount) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

import axios from "axios";

const BASE_URL = "https://panda-market-api-crud.vercel.app/docs";

function validatedName(availableNames, targetObject) {
  const available = new Set(availableNames);
  const propertyNames = Object.keys(targetObject);
  if (!propertyNames.every((key) => available.has(key)))
    throw new Error(`${propertyNames} are not in ${availableNames}`);
}

function validatedListParams(params) {
  const availableParmas = ["page", "pageSize", "orderBy", "keyword"];
  validatedName(availableParmas, params);
}

const productFromInfo = ({ name, description, price, tags, images }) =>
  new Product(name, description, price, tags, images);

export async function getProductList(params = {}) {
  try {
    validatedListParams(params);
    const response = await axios.get(`${BASE_URL}/product`, { params: params });
    console.log("리스트 조회 성공임ㅋ");
    console.log(`- 총 ${response.data.length}개의 상품을 가져왔습니다.`);
    const productList = response.data.list ?? [];
    return productList.map(productFromInfo);
  } catch (error) {
    console.error("리스트 조회실패!! :", error.message);
    throw error;
  }
}

export async function getProduct(id) {
  try {
    const response = await axios.get(`${BASE_URL}/product/${id}`);
    console.log("Product 조회 성공:");
    console.log(`- ID:  ${response.data.id}, 상품명:  ${response.data.name}`);
    return productFromInfo(response.data);
  } catch (error) {
    console.error(`Product 조회 실패!! ${id}:`, error.message);
    throw error;
  }
}

export async function createProduct(product) {
  const { name, description, price, tags, images } = product;
  try {
    const response = await axios.post(`${BASE_URL}/product`, {
      name,
      description,
      price,
      tags,
      images,
    });

    console.log("Product 생성 성공:");
    console.log(`- ID: ${response.data.id}, 상품명: ${response.data.name}`);

    return response.data;
  } catch (error) {
    console.error(" Product 생성 실패!!:", error.message);
    throw error;
  }
}

export async function patchProduct(id, updateData) {
  try {
    const response = await axios.patch(`${BASE_URL}/product/${id}`, updateData);

    console.log("Product 수정 성공:");
    console.log(`- ID: ${response.data.id}, 상품명: ${response.data.name}`);

    return response.data;
  } catch (error) {
    console.error(`Product 수정 실패!! (ID: ${id}):`, error.message);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    await axios.delete(`${BASE_URL}/product/${id}`);

    console.log("Product 삭제 성공:");
    console.log(`- ID: ${id} 상품이 삭제되었습니다.`);

    return null;
  } catch (error) {
    console.error(` Product 삭제 실패!! (ID: ${id}):`, error.message);
    throw error;
  }
}

function createProductInstance({ tags, ...data }) {
  const fullData = { tags, ...data };
  if (tags && tags.includes("전자제품")) {
    return new ElectronicProduct(fullData);
  } else {
    return new Product(fullData);
  }
}
