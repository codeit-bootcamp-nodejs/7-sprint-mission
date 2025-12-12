import { BadRequestError } from "../../../errors/coustomErrors.js";
import { validateCreateAt } from "../../../utils/validateCreatedAt.js";
import { validateStringId } from "../../../utils/validateStringId.js";

const validateName = (name) => {
  if (typeof name !== "string") {
    throw new BadRequestError(`Invalid id type ${typeof name}`);
  }
  if (name.length > 15) {
    throw new BadRequestError(`Name too long ${name.length}`);
  }
};

const validateDescription = (description) => {
  if (description > 1000) {
    throw new BadRequestError(`Description too long ${description.length}`);
  }
};

const validatePrice = (price) => {
  if (typeof price !== "number") {
    throw new BadRequestError(`Invalid price type ${typeof price}`);
  }
};

const validateTags = (tags) => {
  if (!Array.isArray(tags)) {
    throw new BadRequestError(
      `Expected tags to be an array, but got ${typeof tags}`
    );
  }
};

const validateProductInfo = ({
  id,
  name,
  description,
  price,
  tags,
  createdAt,
}) => {
  validateStringId(id);
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTags(tags);
  validateCreateAt(createdAt);
};

const UnregisteredProductInfo = ({ name, price, description, tags }) => {
  validateName(name);
  validateDescription(description);
  validatePrice(price);
  validateTags(tags);
};

export class Product {
  constructor({ id, name, description, price, tags, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  static fromEntity(product) {
    const info = {
      ...product,
      id: product.id.toString(),
      createdAt: product.created_at,
    };

    validateProductInfo(info);

    return new Product(info);
  }
}

export class UnregisteredProduct {
  constructor({ name, price, description, tags }) {
    ((this.name = name),
      (this.price = price),
      (this.description = description),
      (this.tags = tags));
  }

  static fromInfo({ name, price, description = "", tags = [] }) {
    const info = { name, price, description, tags };

    UnregisteredProductInfo(info);

    return new UnregisteredProduct(info);
  }
}
