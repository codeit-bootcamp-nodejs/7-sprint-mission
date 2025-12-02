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

  validateName(name) {
    if (!name || typeof name !== "string") {
      throw new HTTPError(400, "Name is required and must be a string");
    }
  }

  validateDescription(description) {
    if (description && typeof description !== "string") {
      throw new HTTPError(400, "Description must be a string");
    }
  }

  validatePrice(price) {
    if (price === undefined || typeof price !== "number" || price < 0) {
      throw new HTTPError(
        400,
        "Price is required and must be a non-negative number"
      );
    }
  }

  validateTags(tags) {
    if (
      tags &&
      (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string"))
    ) {
      throw new HTTPError(400, "Tags must be an array of strings");
    }
  }

  validate() {
    this.validateName(this.name);
    this.validateDescription(this.description);
    this.validatePrice(this.price);
    this.validateTags(this.tags);
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
