import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
  ofProduct,
} from "./ProductService.js";

export class Product {
  #favoriteCount; //private 필드로 캡슐화

  constructor(name, description, price, tags, images) {
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

  get favoriteCount() {
    return this.#favoriteCount;
  }
}

export class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, manufacturer) {
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }

  favorite() {
    super.favorite();
  }
}

export class Article {
  #likeCount; //private 필드로 캡슐화

  constructor(title, content, image, createdAt) {
    this.title = title;
    this.content = content;
    this.image = image;
    this.createAt = createdAt;
    this.#likeCount = 0;
  }

  like() {
    this.#likeCount++;
  }

  get likeCount() {
    //getter 숨겨둔 내부 상태를 보여줄 필요가 있을때
    return this.#likeCount;
  }
}

//작동 여부 확인

//product
//getProductList(1, 5, "영양갱");

//getProduct(555);

//deleteProduct(2773);

// createProduct(
//   "영양갱",
//   "맛있음",
//   30000,
//   ["반품", "왜반품?"],
//   "https://yang.com"
// );

// patchProduct(
//   2773,
//   "영양갱 수정본",
//   "맛있음 수정본",
//   30000,
//   ["수정했네", "왜반품?"],
//   "https://yangyang.com"
// );

//getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
// let products = [];
// const product = getProductList(1, 5, "컴퓨터");
// products = Promise.resolve(product).then((response) => response.map(ofProduct));
// Promise.resolve(products).then(console.log);
