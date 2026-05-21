export class Product {
  #favoriteCount; // private 필드로 캡슐화

  constructor(name, description, price, tags = [], images = []) {
    validateProduct(name, description, price, tags, images);
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
}

/**
 * Product 데이터 검증
 * @param {Object} productData - 검증할 Product 데이터
 * @throws {Error} 검증 실패 시 에러 발생
 */
function validateProduct(name, description, price, tags, images) {
  // 필수 필드 존재 여부 확인
  const missingFields = [];
  if (name === undefined) missingFields.push("name");
  if (description === undefined) missingFields.push("description");
  if (price === undefined || price === null) missingFields.push("price");
  if (!tags) missingFields.push("tags");
  if (!images) missingFields.push("images");

  if (missingFields.length > 0) {
    throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(", ")}`);
  }

  // 데이터 타입 검증
  if (typeof name !== "string") {
    throw new Error("name은 문자열이어야 합니다.");
  }
  if (typeof description !== "string") {
    throw new Error("description은 문자열이어야 합니다.");
  }
  if (typeof price !== "number" || price < 0) {
    throw new Error("price는 0 이상의 숫자여야 합니다.");
  }
  if (!Array.isArray(tags)) {
    throw new Error("tags는 배열이어야 합니다.");
  }
  if (!Array.isArray(images)) {
    throw new Error("images는 배열이어야 합니다.");
  }
}

// ElectronicProduct 클래스 - 상속
export class ElectronicProduct extends Product {
  constructor(name, description, price, tags = [], images = [], manufacturer) {
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }

  // 다형성: 부모 클래스의 메소드를 오버라이드할 수 있음
  favorite() {
    super.favorite();
    console.log(`${this.manufacturer}의 ${this.name} 제품이 찜되었습니다.`);
  }
}

// Article 클래스
export class Article {
  #likeCount; // private 필드로 캡슐화
  #createdAt; // private 필드로 캡슐화

  constructor(title, content, writer) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.#likeCount = 0;
    this.#createdAt = new Date(); // 현재 시간 저장
  }

  // 좋아요 메소드
  like() {
    this.#likeCount++;
  }
}

