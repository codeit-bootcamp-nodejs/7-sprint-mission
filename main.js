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
