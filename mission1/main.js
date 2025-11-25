// 클래스 구현하기
// 각 클래스 마다 constructor를 작성해 주세요.
// 추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.

// class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.
// Product 클래스는 name(상품명) description(상품 설명), price(판매 가격), tags(해시태그 배열), images(이미지 배열), favoriteCount(찜하기 수)프로퍼티를 가집니다.
// Product 클래스는 favorite 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
export class Product{
#favoriteCount;
constructor(name, description, price, tag, images) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tag = tag;
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
// ElectronicProduct 클래스는 Product를 상속하며, 추가로 manufacturer(제조사) 프로퍼티를 가집니다.
export class ElectronicProduct extends Product{
constructor(name, description, price, tag, images, manufacturer) {
    super(name, description, price, tag, images);
    this.manufacturer = manufacturer;
}
}


// class 키워드를 이용해서 Article 클래스를 만들어 주세요.
// Article 클래스는 title(제목), content(내용), writer(작성자), likeCount(좋아요 수) 프로퍼티를 가집니다.
// Article 클래스는 like 메소드를 가집니다. like 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
// Article 요청 함수 구현하기 (심화)
// Article 클래스에 createdAt(생성일자) 프로퍼티를 만들어 주세요.
// 새로운 객체가 생성되어 constructor가 호출될 시 createdAt에 현재 시간을 저장합니다.
export class Article {
  #likeCount;
  constructor(title, content, image) {
    this.title = title;
    this.content = content;
    this.image = image;
    this.#likeCount = 0;
    this.createdAt = new Date();
  }
  like() {
    this.#likeCount++;
  }
  get likeCount() {
    return this.#likeCount;
  }
    static of({ title, content, image }) {
    return new Article(title, content, image);
  }
}




