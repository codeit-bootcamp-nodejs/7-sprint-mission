import axios from "axios";

const APIURL = "https://panda-market-api-crud.vercel.app";

export async function getProductList(page, pageSize, keyword) {
  try {
    const response = await axios.get(`${APIURL}/products`, {
      params: {
        page: page,
        pageSize: pageSize,
        keyword: keyword,
      },
    });

    console.log("상품 목록 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error ${error.response.status} (상품 목록): ${
          error.response.data.message || "서버 오류"
        }`
      );
    } else {
      console.error("요청 실패 (상품 목록):", error.message);
    }
  }
}
export async function getProduct(id) {
  try {
    const response = await axios.get(`${APIURL}/products/${id}`);

    console.log("상품 상세 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error ${error.response.status} (상품 상세): ${
          error.response.data.message || "상품을 찾을 수 없습니다."
        }`
      );
    } else {
      console.error("요청 실패 (상품 상세):", error.message);
    }
  }
}
export async function createProduct(name, description, price, tags, images) {
  const productData = {
    name: name,
    description: description,
    price: price,
    tags: tags,
    images: images,
  };

  try {
    const response = await axios.post(`${APIURL}/products`, productData);

    console.log("상품 생성 성공:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error ${error.response.status} (상품 생성): ${
          error.response.data.message || "생성 실패"
        }`
      );
    } else {
      console.error("요청 실패 (상품 생성):", error.message);
    }
  }
}
export async function patchProduct(id, updateData) {
  try {
    const response = await axios.patch(`${APIURL}/products/${id}`, updateData);

    console.log("상품 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error ${error.response.status} (상품 수정): ${
          error.response.data.message || "수정 실패"
        }`
      );
    } else {
      console.error("요청 실패 (상품 수정):", error.message);
    }
  }
}
export async function deleteProduct(id) {
  try {
    const response = await axios.delete(`${APIURL}/products/${id}`);
    console.log(`상품 삭제 성공 (ID: ${id}): ${response.status}`);
    return response.status;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error ${error.response.status} (상품 삭제): ${
          error.response.data.message || "삭제 실패"
        }`
      );
    } else {
      console.error("요청 실패 (상품 삭제):", error.message);
    }
  }
}
