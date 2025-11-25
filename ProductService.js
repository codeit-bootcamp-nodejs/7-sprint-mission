import axios from "axios";
import { Product, ElectronicProduct } from "./main.js";

const base_url = "https://panda-market-api-crud.vercel.app";
//export default ProductService;

function getQueryParameter(page, pageSize, keyword) {
   const paramList = [];
   if (page !== undefined) {
      paramList.push(`pageSize=${pageSize}`);
   }
   if (pageSize !== undefined) {
      paramList.push(`pageSize=${pageSize}`);
   }
   if (keyword !== undefined) {
      paramList.push(`pageSize=${keyword}`);
   }
   return paramList.join("&");
}

async function getProductList(page, pageSize, keyword) {
   //get 메소드 사용
   //products = List -> 각각 instance
   //1.URL 확보
   const queryParam = getQueryParameter(page, pageSize, keyword);
   if (queryParam !== "") base_url += `?${queryParam}`;
   //2. REST 요청
   const productListResponse = await axios.get(`${base_url}/products`, { queryParam });
   //3. response를 처리해서 원하는 결과 얻기
   if (tags.includes("전자제품")) {
      const electronicProductList = productListResponse.data.list.map(
         ({ name, description, price, tags, images }) =>
            new ElectronicProduct(name, description, price, tags, images, manufacturer)
      );
      return electronicProductList;
   } else {
      const productList = productListResponse.data.list.map(
         ({ name, description, price, tags, images }) => new Product(name, description, price, tags, images) //productList를 보고, 새로운 객체 Product로 만들겠다.
      ); // response 밑에 data밑에 list 내에 정보들이 있다.
      console.log(productList);
      return productList;
   }
}
//getProductList();

export async function getProduct(productId) {
   //get메소드 사용
   try {
      const getProductResponse = await axios.get(`${base_url}/products/${productId}`);
      //console.log(getProductResponse);
      //console.log(getProductResponse.data);

      const { name, description, price, tags, images, manufacturer } = getProductResponse.data;
      if (tags.includes("전자제품")) {
         const WantElectronicProduct = new ElectronicProduct(name, description, price, tags, images, manufacturer);
         return WantElectronicProduct;
      } else {
         const WantProduct = new Product(name, description, price, tags, images);
         return WantProduct;
      }
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }
}
const testGetProduct = await getProduct(2738);
console.log(testGetProduct);

export async function createProduct(product) {
   //request body에 name, description, price, tags, images 포함시키기
   try {
      const { name, description, price, tags, images } = product;
      const createResponse = await axios.post(`${base_url}/products/`, {
         name,
         description,
         price,
         tags,
         images,
      });
      return createResponse.data;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }
}
/* test 용 예시
createProduct({
   name: "냉장고",
   description: "전자제품",
   price: 120000,
   tags: ["전자제품"],
   images: ["https://www.example.com"],
});*/

/*CreateProductBody{
images*	[...]
tags*	[...]
price*	Price[...]
description*	[...]
name*	ProductName[...]
} */

export async function patchProduct(productId, patchData) {
   // patch 메소드 사용
   try {
      const patchProductResponse = await axios.patch(`${base_url}/products/${productId}`, patchData);
      return patchProductResponse.data;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }
}
export async function deleteProduct(productId) {
   //delete 메소드 사용
   //async/await 을 이용하여 비동기 처리를 해주세요.
   //try/catch 를 이용하여 오류 처리를 해주세요.
   try {
      await axios.delete(`${base_url}/products/${productId}`);
      console.log("Product 삭제 성공 :");
      console.log(`ID: ${productId} 상품이 삭제되었습니다.`);

      return null;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }
}
/*async function getProductList(page, pageSize, keyword) {
   // 1. URL 확보

   const paramUrl = paramObjectToString(paramObject);

   let url = productBaseUrl;
   if (paramUrl !== "") {
      url += `?${paramUrl}`;
   }

   // 2. Request
   const resp = await axios.get(url);
   const productInfoList = resp.data.list;

   // 3. Product[] 만들기
   return productInfoList.map(
      ({ name, description, price, tags, images }) => new Product(name, description, price, tags, images)
   );
}*/
