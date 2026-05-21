import axios from "axios";
import { Product, ElectronicProduct } from "./main.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app";

export function validateProduct(productData) {
  if (!productData) throw new Error("productData가 제공되지 않았습니다.");
  const { name, description, price, tags, images } = productData;

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!description) missingFields.push("description");
  if (price === undefined || price === null) missingFields.push("price");
  if (!tags) missingFields.push("tags");
  if (!images) missingFields.push("images");
  if (missingFields.length > 0)
    throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(", ")}`);

  if (typeof name !== "string") throw new Error("name은 문자열이어야 합니다.");
  if (typeof description !== "string")
    throw new Error("description은 문자열이어야 합니다.");
  if (typeof price !== "number" || price < 0)
    throw new Error("price는 0 이상의 숫자여야 합니다.");
  if (!Array.isArray(tags)) throw new Error("tags는 배열이어야 합니다.");
  if (!Array.isArray(images)) throw new Error("images는 배열이어야 합니다.");
}

export async function getProductList(params = {}) {
  try {
    const response = await axios.get(`${BASE_URL}/products`, { params });
    const products = response.data.list.map((p) =>
      p.tags.includes("전자제품")
        ? new ElectronicProduct(
            p.name,
            p.description,
            p.price,
            p.tags,
            p.images,
            p.manufacturer
          )
        : new Product(p.name, p.description, p.price, p.tags, p.images)
    );
    return products;
  } catch (error) {
    console.error("상품 리스트 조회 실패:", error.message);
    return [];
  }
}
