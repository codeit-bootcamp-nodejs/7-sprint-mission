// routes/users.js
export class Product {
  constructor(id, name, description, price, tags = [], createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  static fromEntity({ id, name, description, price, tags, created_at }) {
    const info = {
      id: id.toString(), // bigInt => string
      name,
      description,
      price: price,
      tags,
      createdAt: created_at,
    };
    validateProductInfo(info);
    // 출입국 심사... imigration입니다...

    return new Product(
      info.id,
      info.name,
      info.description,
      info.price,
      info.tags,
      info.createdAt
    );
  }
}

export class UnregisteredProduct {
  // id, title, content, createdAt를 조회합니다.
  // 외부에서 쓰지 못한다.
  constructor(name, description, price, tags) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
  }

  static fromInfo({ name, description, price, tags }) {
    const info = {
      name,
      description,
      price,
      tags,
    };
    validateUnregisteredProductInfo(info);
    // 출입국 심사... imigration입니다...

    return new UnregisteredProduct(
      info.name,
      info.description,
      info.price,
      info.tags
    );
  }
}
function validateId(id) {
  if (typeof id !== "string") {
    throw new Error(`Invalid id type ${typeof id}}`);
  }
}

function validateName(name) {
  if (!name) throw new Error("Falsy name");
  if (name.length > 255) {
    throw new Error(`Name too long ${name.length}`);
  }
}

function validateDescription(description) {
  if (!description) throw new Error("Falsy description");
  if (description.length > 10000) {
    throw new Error(`Description too long ${description.length}`);
  }
}

function validatePrice(price) {
  if (!price) throw new Error("Falsy price");
  if (typeof price !== "number") {
    throw new Error(`Invalid price type ${typeof price}}`);
  }
}

function validateTags(tags) {
  if (!tags) throw new Error("Falsy tags");
}

function validateCreateAt(createat) {
  if (new Date("2024-01-01") > createat) {
    throw new Error(`Invalid createAT ${createat.toString()}`);
  }
}

function validateProductInfo({
  id,
  name,
  description,
  price,
  tags,
  createdAt,
}) {
  validateId(id);
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTags(tags);
  validateCreateAt(createdAt);
}

function validateUnregisteredProductInfo({ name, description, price, tags }) {
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTags(tags);
}
