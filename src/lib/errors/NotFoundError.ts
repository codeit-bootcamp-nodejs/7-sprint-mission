import { CustomError } from './CustomError';

const MODEL_NAME = {
    User: "사용자",
    Product: "상품",
    Article: "게시글",
    Comment: "댓글",
    ProductLike: "상품 좋아요",
    ArticleLike: "게시글 좋아요",
} as const;
type ModelNameKey = keyof typeof MODEL_NAME;

export class NotFoundError extends CustomError {
    constructor(modelName : ModelNameKey | string, id : number) {
        const errorModelName =
            modelName in MODEL_NAME
                ? MODEL_NAME[modelName as ModelNameKey]
                : modelName;

        super(`${errorModelName}을(를) 찾을 수 없습니다. (id : ${id})`, 404);
        this.name = 'NotFoundError';
    }
}
