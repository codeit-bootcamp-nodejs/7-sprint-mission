// ## 클래스 구현하기
// - `class` 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.

export class Product {
  #favoriteCount;

  //     - Product 클래스는 `name`(상품명) `description`(상품 설명), `price`(판매 가격), `tags`(해시태그 배열), `images`(이미지 배열), `favoriteCount`(찜하기 수)프로퍼티를 가집니다.
  constructor(name, description, price, tags, images) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;

    this.#favoriteCount = 0;
  }

  //     - Product 클래스는 `favorite` 메소드를 가집니다. `favorite` 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
  favorite() {
    this.#favoriteCount++; // 0 1 2
  }

  get favoriteCount() {
    // getter 숨겨둔 내부 상태를 보여줄 필요가 있을때
    return this.#favoriteCount;
  }
}
export class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, manufacturer) {
    // instantiation
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }
}
