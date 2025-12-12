import { validateCreateAt } from "../../../utils/validateCreatedAt.js";
import { validateStringId } from "../../../utils/validateStringId.js";

const validateContent = (content) => {
  if (typeof content !== "string") {
    throw new Error(`Invalid content type ${typeof content}`);
  }
  if (content.length > 255) {
    throw new Error(`Title too long ${content.length}`);
  }
};

const validateProductCommentInfo = ({ id, content, createdAt }) => {
  validateStringId(id);
  validateContent(content);
  validateCreateAt(createdAt);
};

export class ProductComment {
  constructor({ id, content, createdAt, productId }) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.productId = productId;
  }

  static fromEntity({ id, content, createdAt, productId }) {
    const info = {
      id: id.toString(),
      content,
      created_at: createdAt,
      product_id: productId,
    };

    validateProductCommentInfo(info);

    return new ProductComment(info);
  }
}
