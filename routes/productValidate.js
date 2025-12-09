//클래스
export class Product {
  constructor(id, name, description, price, tags, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  static fromEntity({ id, name, description, price, tags, created_at }) {
    return new Product(
      id.toString(),
      name,
      description,
      price,
      tags,
      created_at
    );
  }
}

export class UnregisteredProduct {
  // id, title, content, createdAt를 조회합니다.
  // 외부에서 쓰지 못한다.
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  static fromInfo({ name, description }) {
    const info = {
      name,
      description,
    };
    validateUnregisteredProductInfo(info);
    // 출입국 심사... imigration입니다...

    return new UnregisteredProduct(info.name, info.description);
  }
}

function validateId(id) {
  if (typeof id !== "string") {
    throw new Error(`Invalid id type ${typeof id}}`);
  }
}

function validatePrice(price) {
  if (typeof price !== number) {
    throw new Error(`Invalid id type ${typeof price}}`);
  }
}

function validateName(name) {
  if (name.length > 255) {
    throw new Error(`Title too long ${name.length}`);
  }
}

function validateTags(tags) {
  if (tags.length > 255) {
    throw new Error(`Title too long ${tags.length}`);
  }
}

function validateDescription(description) {
  if (description.length > 10000) {
    throw new Error(`description too long ${description.length}`);
  }
}

function validateCreated_at(created_at) {
  if (new Date("2024-01-01") > created_at) {
    throw new Error(`Invalid createAT ${created_at.toString()}`);
  }
}

function validateProductInfo({
  id,
  name,
  description,
  createdAt,
  price,
  tags,
}) {
  validateId(id);
  validateName(name);
  validateDescription(description);
  validateCreated_at(createdAt);
  validatePrice(price);
  validateTags(tags);
}
