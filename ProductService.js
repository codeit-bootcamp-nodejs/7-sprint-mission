// async/await 을 이용하여 비동기 처리를 해주세요.
// try/catch 를 이용하여 오류 처리를 해주세요.
// getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
// 해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
// 나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.
import axios from "axios";
import { Product, ElectronicProduct} from "./main2.js";

// ✨ logAndThrow는 맨 위에서 딱! 선언해주는 게 가장 좋아.
const logAndThrow = (error) => {
    console.error("Error occurred:", error); // "Error fetching product list;" 대신 좀 더 범용적으로 고쳐봤어!
    throw error;
};

// Product 요청 함수 구현하기
function requestGetProductList(params) {
    const url = "https://panda-market-api-crud.vercel.app/products";
    return axios.get(url, {params});
}
// https://panda-market-api-crud.vercel.app/docs 의 Product API를 이용하여 아래 함수들을 구현해 주세요.
// getProductList() : GET 메소드를 사용해 주세요.
// page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.

// ✨ 상품 정보에서 Product 또는 ElectronicProduct 인스턴스를 생성해주는 헬퍼 함수
const createProductInstance = (info) => {
    // tags는 배열이니까 .includes()로 "전자제품" 태그가 있는지 확인해야 해!
    if (info.tags && info.tags.includes("전자제품")) {
        return new ElectronicProduct(info.name, info.description, info.price, info.tags, info.images);
    }
    return new Product(info.name, info.description, info.price, info.tags, info.images);
};

async function getProductList(params = {}) { // Params -> params로 소문자화
    const url = "https://panda-market-api-crud.vercel.app/products";
    try {
        const response = await axios.get(url, { params });
        // 응답 데이터는 response.data.list 에 배열 형태로 들어있을 거야! [【2】](about:blank)
        const products = response.data.list.map(info => createProductInstance(info));
        return products;
    } catch (error) {
        logAndThrow(error);
    }
}

// getProduct() : GET 메소드를 사용해 주세요.
function requestGetProduct(productId) {
    const url = `https://panda-market-api-crud.vercel.app/products/${productId}`; // ✨ 여기도 products!
    return axios.get(url);
}

async function getProduct(productId) {
    const url = `https://panda-market-api-crud.vercel.app/products/${productId}`; // ✨ articles 대신 products! 슬래시도 잊지 마!
    try {
        const response = await axios.get(url);
        // 단일 상품 응답은 response.data 에 바로 상품 정보가 있을 거야!
        const productInfo = response.data;
        return createProductInstance(productInfo); // ✨ 헬퍼 함수 활용!
    } catch (error) {
        logAndThrow(error);
    }
}

// createProduct() : POST 메소드를 사용해 주세요.
// request body에 name, description, price, tags, images 를 포함해 주세요.
function createProduct(product) {
    return axios
        .post("https://panda-market-api-crud.vercel.app/products", product) // ✨ URL 다음에 product 객체 전달!
        .then(response => response.data) // 생성된 상품 정보 반환
        .catch(logAndThrow);
}

// patchProduct() : PATCH 메소드를 사용해 주세요.
function patchProduct(productId, product) {
    return axios
        .patch(`https://panda-market-api-crud.vercel.app/products/${productId}`, product) // ✨ URL 수정 및 product 객체 전달!
        .then(response => response.data) // 업데이트된 상품 정보 반환
        .catch(logAndThrow);
}

// deleteProduct() : DELETE 메소드를 사용해 주세요.
function deleteProduct(productId) {
    return axios
        .delete(`https://panda-market-api-crud.vercel.app/products/${productId}`) // ✨ product 대신 products!
        .then(response => response.data) // 삭제된 후 API가 돌려주는 데이터를 그대로 반환
        .catch(logAndThrow);
}




