import * as ProductService from "./ProductService.js";
import * as ArticleService from "./ArticleService.js";

export class Product {
  #favoriteCount;
  constructor(name, description, price, tags = [], images = []) {
    this.name = name; //상품명
    this.description = description; //상품설명
    this.price = price; // 판매가격
    this.tags = tags; // 해시태그 배열
    this.images = images; // 이미지 배열
    this.#favoriteCount = 0; // 찜하기 수 프로퍼티
  } // prodeuct 메소드, 호출 될 경우 찜하기 수 증가
  favorite() {
    this.#favoriteCount++;
  }
  get favoriteCount() {
    //getter 숨겨둥 여부 상태 보여줄 필요가ㅏ 있을떄
    return this.#favoriteCount;
  }

  static of({ name, description, price, tags, images }) {
    return new Product(name, description, price, tags, images);
  }
}

export class ElectronicProduct extends Product {
  //prodect 클래스 상속, manufacturer(제조사)프로퍼티 가짐
  constructor(name, description, price, tags = [], images = [], manufacturer) {
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer; //제조사
  }
  // 다형성: 부모 클래스의 메소드를 오버라이드할 수 있음
  favorite() {
    super.favorite();
    console.log(`${this.manufacturer}의 ${this.name} 제품이 찜되었습니다.`);
  }
}

export class Article {
  // title(제목), content(내용), writer(작성자), likeCount(좋아요 수) 가짐
  #likeCount; // private 필드로 캡슐화
  #createdAt;

  constructor(title, content, images) {
    this.title = title;
    this.content = content;
    this.images = images;
    this.#likeCount = 0;
    this.#createdAt = new Date(); // 현재 시간 저장
  }

  // 좋아요 메소드
  like() {
    this.#likeCount++; // return 안해서 ++ 앞에 붙이는게 아니라 뒤에 붙임
  }
  get likeCount() {
    return this.#likeCount;
  }
  get createdAt() {
    return this.#createdAt;
  }
  static of({ title, content, images }) {
    return new Article(title, content, images);
  }
}

//getProductList 작동 테스트
getProductList({ page: 1, pageSize: 5 }).then(console.log);

//getProduct 작동 테스트
getProduct(2793).then(console.log);

//createProduct 작동 테스트
createProduct({
  name: "🐶강아지",
  description: "string",
  price: "300000",
  tags: "Pet",
  images: "https://t1.daumcdn.net/cfile/tistory/995F9E435B6C5B9E22",
}).then(console.log);

//patchProduct 작동 테스트
patchProduct(2793, {
  name: "맥북",
  description: "맥북 air",
  price: "1600000",
  tags: "전자제품",
  images:
    "https://www.apple.com/assets-www/en_WW/mac/01_product_tile/small/mba_13_15_e1e5effed_2x.jpg",
}).then(console.log);

//deleteProduct 작동 테스트
deleteProduct(2789).then(console.log);

// getArticleList 작동 테스트
ArticleService.getArticleList({ page: 1, pageSize: 5, keyword: "내용" }).then(
  console.log
);

// getArticle 작동 테스트
ArticleService.getArticle(5314).then(console.log);

// createArticle 작동 테스트
ArticleService.createArticle(
  new Article("자바스크립트.", "어려워..", "https://example.com/...")
).then(console.log);

// patchArticle 작동 테스트
ArticleService.patchArticle(5314, {
  title: "게시글 제목입니다.",
  content: "게시글 내용입니다.",
  image: "https://example.com/...",
}).then(console.log);

// deleteArticle 작동 테스트
ArticleService.deleteArticle(5312).then(console.log);
