import axios from "axios";
import { Product, ElectronicProduct } from "./main.js";

const BASIC_URL = "https://panda-market-api-crud.vercel.app/products";

export async function getProductList(page, pageSize, keyword) {
  try {
    const url = `${BASIC_URL}?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`;
    const response = await axios.get(url);

    return response.data.list;
  } catch (error) {
    console.error("getProductList 조회 실패", error);
    throw error;
  }
}

export async function getProduct(productId) {
  try {
    const url = `${BASIC_URL}/${productId}`;
    const response = await axios.get(url);

    console.log(response.data);
  } catch (error) {
    console.error("getProduct 조회 실패", error);
    throw error;
  }
}

export async function createProduct(name, description, price, tags, images) {
  try {
    const url = `${BASIC_URL}`;

    const createData = {
      name: name,
      description: description,
      price: price,
      tags: tags,
      images: images,
    };

    const response = await axios.post(url, createData);
    console.log(response.data);
  } catch (error) {
    console.error("createProduct 생성 실패", error);
    throw error;
  }
}

export async function patchProduct(
  productId,
  name,
  description,
  price,
  tags,
  images
) {
  try {
    const url = `${BASIC_URL}/${productId}`;
    const patchData = {
      name: name,
      description: description,
      price: price,
      tags: tags,
      images: images,
    };
    const response = await axios.patch(url, patchData);

    console.log(response.data);
  } catch (error) {
    console.error("patchProduct 수정 실패", error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const url = `${BASIC_URL}/${productId}`;
    const response = await axios.delete(url);

    console.log(response);
  } catch (error) {
    console.error("deleteProduct 삭제 실패", error);
    throw error;
  }
}

export function ofProduct({
  name,
  description,
  price,
  tags,
  images,
  menuFacturer,
}) {
  if (tags.some((tag) => tag.includes("전자제품"))) {
    return new ElectronicProduct(
      name,
      description,
      price,
      tags,
      images,
      menuFacturer
    );
  }
  return new Product(name, description, price, tags, images);
}

//궁금해서 혼자 만드는 거
async function multiplePatch() {
  const url = `${BASIC_URL}`;
  const response = await axios.get(url);

  const arrIdData = response.data.list.map((item) => item.id);

  console.log(response.data.list);

  for (const key in arrIdData) {
    await axios.patch(`${url}/${arrIdData[key]}`, { name: "바꿔버렷" });
  }
}
