// async/await 을 이용하여 비동기 처리를 해주세요.
// try/catch 를 이용하여 오류 처리를 해주세요.
// getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
// 해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
// 나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.
import axios from "axios";
import { Product, ElectronicProduct} from "./main2.js";
import { logAndThrow } from "./LogAndThrow.js;"


// Product 요청 함수 구현하기
function requestGetProductList(params) {
    const url = "https://panda-market-api-crud.vercel.app/products";
    return axios.get(url, {params});
}
// https://panda-market-api-crud.vercel.app/docs 의 Product API를 이용하여 아래 함수들을 구현해 주세요.
// getProductList() : GET 메소드를 사용해 주세요.
// page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.

const createProductInstance = (info) => {
    if (info.tags && info.tags.includes("전자제품")) {
        return new ElectronicProduct(info.name, info.description, info.price, info.tags, info.images);
    }
    return new Product(info.name, info.description, info.price, info.tags, info.images);
};

async function getProductList(params = {}) { // Params -> params로 소문자화
    const url = "https://panda-market-api-crud.vercel.app/products";
    try {
        const response = await axios.get(url, { params });
        
        const products = response.data.list.map(info => createProductInstance(info));
        return products;
    } catch (error) {
        logAndThrow(error);
    }
}

// getProduct() : GET 메소드를 사용해 주세요.
function requestGetProduct(productId) {
    const url = `https://panda-market-api-crud.vercel.app/products/${productId}`; 
    return axios.get(url);
}

async function getProduct(productId) {
    const url = `https://panda-market-api-crud.vercel.app/products/${productId}`; 
    try {
        const response = await axios.get(url);
        const productInfo = response.data;
        return createProductInstance(productInfo); 
    } catch (error) {
        logAndThrow(error);
    }
}

// createProduct() : POST 메소드를 사용해 주세요.
// request body에 name, description, price, tags, images 를 포함해 주세요.
function createProduct(product) {
    return axios
        .post("https://panda-market-api-crud.vercel.app/products", product) 
        .then(response => response.data) 
        .catch(logAndThrow);
}

// patchProduct() : PATCH 메소드를 사용해 주세요.
function patchProduct(productId, product) {
    return axios
        .patch(`https://panda-market-api-crud.vercel.app/products/${productId}`, product) 
        .then(response => response.data) 
        .catch(logAndThrow);
}

// deleteProduct() : DELETE 메소드를 사용해 주세요.
function deleteProduct(productId) {
    return axios
        .delete(`https://panda-market-api-crud.vercel.app/products/${productId}`) 
        .then(response => response.data) 
        .catch(logAndThrow);
}




