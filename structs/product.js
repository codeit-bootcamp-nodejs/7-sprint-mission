import { HTTPError } from "../error.js";

export class Product {
  constructor(id, name, description, price, tags, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  static validateId(id) {
    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }
  }

  static validateName(name) {
    if (!name || typeof name !== "string") {
      throw new HTTPError(400, "Name is required and must be a string");
    }
  }

  static validateDescription(description) {
    if (description && typeof description !== "string") {
      throw new HTTPError(400, "Description must be a string");
    }
  }

  static validatePrice(price) {
    if (price === undefined || typeof price !== "number" || price < 0) {
      throw new HTTPError(
        400,
        "Price is required and must be a non-negative number"
      );
    }
  }

  static validateTags(tags) {
    if (
      tags &&
      (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string"))
    ) {
      throw new HTTPError(400, "Tags must be an array of strings");
    }
  }

  static validateCreate(body) {
    Product.validateName(body.name);
    Product.validateDescription(body.description);
    Product.validatePrice(body.price);
    Product.validateTags(body.tags);
  }

  static validateUpdate(body) {
    if (body.name !== undefined) Product.validateName(body.name);
    if (body.description !== undefined)
      Product.validateDescription(body.description);
    if (body.price !== undefined) Product.validatePrice(body.price);
    if (body.tags !== undefined) Product.validateTags(body.tags);
  }

  validate() {
    Product.validateName(this.name);
    Product.validateDescription(this.description);
    Product.validatePrice(this.price);
    Product.validateTags(this.tags);
  }

  static fromEntity(entity) {
    const product = new Product(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags,
      entity.created_at
    );
    product.validate();
    return product;
  }
}

export default Product;
