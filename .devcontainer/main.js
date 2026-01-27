export class Product {
  #favoriteCount;

  constructor(name, description, price, tags = [], images = []) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.#favoriteCount = 0;
  }

  favor() {
    this.#favoriteCount++;
  }
}

export class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags = [],
    images = [],
    manufacturer = ""
  ) {
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }

  favor() {
    super.favor();
    console.log(`${this.manufacturer}의 ${this.name} 제품이 찜되었습니다.`);
  }
}

export const productFromInfo = ({
  name,
  description,
  price,
  tags = [],
  images = [],
  manufacturer = "",
}) =>
  new ElectronicProduct(name, description, price, tags, images, manufacturer);
