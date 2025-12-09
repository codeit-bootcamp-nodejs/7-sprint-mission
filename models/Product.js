export class Product {
  constructor(name, description, price, tags = [], images = []) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = 0;
  }

  favorite() {
    this.favoriteCount += 1;
  }
}
