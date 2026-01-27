import { validateHeaderName } from "http";

export class Product {
  constructor(id, name, description, price, tags, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  // 가져온 DB객체를 응답하기 쉽게 미리 변환해주는 로직.
  static fromEntity({ id, name, description, price, tags, create_at }) {
    const info = {
      id: id.toString(),
      name,
      description,
      price,
      tags,
      createAt: create_at,
    };
    validateProductInfo(info);
    return new Product(
      info.id,
      info.name,
      info.description,
      info.price,
      info.tags,
      info.createAt
    );
  }
}

export class UnregisteredProduct {
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
  if (!name) throw new Error("이름을 입력해주세요.");
}

function validateDescription(description) {
  if (!description) throw new Error("내용을 입력해주세요.");
}

function validatePrice(price) {
  if (!price) throw new Error("가격을 입력해주세요.");
}

function validateTags(tags) {
  if (!Array.isArray(tags)) throw new Error("태그는 배열이어야 합니다.");
}

function validateCreateAt(createat) {
  if (new Date("2024-01-01") > createat) {
    throw new Error(`Invalid createAT ${createat.toString()}`);
  }
}

function validateProductInfo({ id, name, description, price, tags, createAt }) {
  validateId(id);
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTags(tags);
  validateCreateAt(createAt);
}

function validateUnregisteredProductInfo({ name, description, price, tags }) {
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTags(tags);
}
