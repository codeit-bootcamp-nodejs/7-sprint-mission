//API 리퀘스트 보내는 코드 구현
import axios from "axios";
import { date } from "fp-ts";

const api = axios.create({
   baseURL: "https://panda-market-api-crud.vercel.app",
   timeout: 5000,
});
export default api;
export class Product {
   #favoriteCount;
   //application/json
   //tags = 전자제품 포함된 것 제외하고 인스턴스 생성
   constructor(name, description, price, tags, images) {
      this.name = name; // name(상품명)
      this.description = description; // description(상품 설명),
      this.price = price; // price(판매 가격),
      this.tags = tags; // tags(해시태그 배열),
      this.images = images; // images(이미지 배열),
      this.#favoriteCount = 0; // favoriteCount(찜하기 수)프로퍼티를 가집니다.
      /*export async function getColorSurveys(queryParams = {}) {
               const response = await api.get("/color-surveys", {
                  params: queryParams, // 자동으로 쿼리 파라미터로 변환
               });
               return response.data;
            }*/
   }
   // Product 클래스는 favorite 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
   //찜하기 메소드
   favorite() {
      this.#favoriteCount++;
   }
}

export class ElectronicProduct extends Product {
   constructor(name, description, price, tags = [], images = [], manufacturer) {
      super(name, description, price, tags, images);
      this.manufacturer = manufacturer; //제조사
   }
   favorite() {
      super.favorite();
      console.log(`${this.manufacturer}의 ${this.name} 제품이 찜 되었습니다.`);
   }
   //tags = 전자제품 포함이면 여기서 인스턴스 생성
}

export class Article {
   #likeCount;
   #createdAt;
   constructor(title, content, writer, images) {
      this.title = title; //제목
      this.content = content; // 내용
      this.writer = writer; //작성자
      this.images = images;
      this.#likeCount = 0; //좋아요 수
      this.#createdAt = new Date();
   }
   like() {
      return this.#likeCount++;
   }
   createdAt() {
      return this.#createdAt;
   }
}

//import ProductService from "./ProductService.js";
//import ArticleService from "./ArticleService.js";

/*추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.

// class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.
// page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.

function paramObjectToString(paramObject) {
   return Object.entries(paramObject)
      .map(([name, val]) => `${name}=${val}`)
      .join("&");
}
import { getProductList } from "./ProductService";
/* 서버에 찜하기 증가 요청 보내기 (gpt)
    try {
      const response = await fetch("https://api.example.com/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: this.name,
          favoriteCount: this.#favoriteCount,
        }),
      });
      const data = await response.json();
      console.log("서버 응답:", data);
    } catch (error) {
      console.error("찜하기 요청 실패:", error);
    }
  } */
/*import axios from "axios";

// 목록 조회
export async function getColorSurveys(queryParams = {}) {
  const response = await api.get("/color-surveys", {
    params: queryParams, // 자동으로 쿼리 파라미터로 변환
  });
  return response.data;
}

// 단건 조회
export async function getColorSurvey(id) {
  const response = await api.get(`/color-surveys/${id}`);
  return response.data;
}

// 생성
export async function createColorSurvey(surveyData) {
  const response = await api.post("/color-surveys", surveyData);
  // JSON.stringify 불필요!
  // Content-Type 자동 설정!
  return response.data;
}

// 수정
export async function updateColorSurvey(id, surveyData) {
  const response = await api.patch(`/color-surveys/${id}`, surveyData);
  return response.data;
}

// 삭제
export async function deleteColorSurvey(id, password) {
  const response = await api.delete(`/color-surveys/${id}`, {
    data: { password },
  });
  return response.data;
}

const newSurvey = {
  mbti: "ENFP",
  colorCode: "#FF6B6B",
  password: "1234",
};

async function doThis() {
  const registered = await createColorSurvey(newSurvey);
  console.log(registered);
  const getResult = await getColorSurvey(registered.id);
  console.log(getResult);

  const updated = await updateColorSurvey(registered.id, {
    ...newSurvey,
    mbti: "INTJ",
  });
  console.log(updated);
  const getResult2 = await getColorSurvey(registered.id);
  console.log(getResult2);
}

doThis(); */

/*const productListResponse = await axios.get(ProductListUrl);
   const productList = productListResponse.data.list.map(
      ({ name, description, price, tags, images }) => new Product(name, description, price, tags, images)
   );

   return productList;
   (강사님 예시 코드)*/

/*https://panda-market-api-crud.vercel.app/docs 의 Product API를 이용하여 
아래 함수들을 구현해 주세요.
getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 
저장해 주세요.

나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.

구현한 함수들을 아래와 같이 파일을 분리해 주세요.

export를 활용해 주세요.
ProductService.js 파일 Product API 관련 함수들을 작성해 주세요.
ArticleService.js 파일에 Article API 관련 함수들을 작성해 주세요.
이외의 코드들은 모두 main.js 파일에 작성해 주세요.
import를 활용해 주세요.
각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요. */
