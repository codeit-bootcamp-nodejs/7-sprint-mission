export class ProductComment {
  constructor(product) {
    this.product = product;
  }
}

export class UnregisteredProduct {
  // id, title, content, createdAt를 조회합니다.
  // 외부에서 쓰지 못한다.
  constructor(name, price, tags, description) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
  }

  static fromInfo({ name, price, tags = [], description }) {
    const info = {
      name,
      price,
      tags,
      description,
    };
    validateUnregisteredProductInfo();

    return new UnregisteredProduct(
      info.name,
      info.price,
      info.tags,
      info.description
    );
  }
}

export class Product {
  constructor(id, createdAt, name, price, tags, description) {
    this.id = id;
    this.createdAt = createdAt;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
  }

  static fromEntity({ id, created_at, name, price, tags = [], description }) {
    const info = {
      id: id.toString(),
      createdAt: created_at,
      name,
      price,
      tags,
      description,
    };
    console.log("info fromEntiry:", info);
    validateProductInfo();

    return new Product(
      info.id,
      info.createdAt,
      info.name,
      info.price,
      info.tags,
      info.description
    );
  }
}

function validateProductInfo() {
  return;
}

function validateUnregisteredProductInfo() {
  return;
}
