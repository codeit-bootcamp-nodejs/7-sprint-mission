import { NotFoundError } from '../lib/errors/NotFoundError';
import { ForbiddenError } from '../lib/errors/ForbiddenError';
import { Comment } from '../classes/Comment';
import * as commentRepository from '../repositories/commentRepository';
import * as productRepository from '../repositories/productRepository';
import * as articleRepository from '../repositories/articleRepository';

export async function createComment(
    id: string,
    userId: string,
    content: string,
    target: 'Product' | 'Article',
): Promise<Comment> {
    switch (target) {
        case 'Product':
            const existingProduct = await productRepository.findProductById({ productId: id });
            if (!existingProduct) {
                throw new NotFoundError('Product', Number(id));
            }
            break;
        case 'Article':
            const existingArticle = await articleRepository.findArticleById({ articleId: id });
            if (!existingArticle) {
                throw new NotFoundError('Article', Number(id));
            }
            break;
        default:
    }

    const createComment = await commentRepository.createComment({
        id,
        content,
        userId,
        target,
    });
    if (!createComment) throw new Error('답글 생성에 실패했습니다.');

    return Comment.fromEntity(createComment);
}

export async function updateComment(
    id: string,
    targetId: string,
    userId: string,
    content: string,
    target: 'Product' | 'Article',
) {
    const existingComment = await commentRepository.findCommentById(id, target);

    if (!existingComment) {
        throw new NotFoundError('Comment', Number(id));
    }
    if (existingComment.userId.toString() !== userId) {
        throw new ForbiddenError('본인의 댓글만 수정할 수 있습니다.');
    }
    const updatedComment = await commentRepository.updateComment(
        id,
        targetId,
        userId,
        content,
        target,
    );
    return Comment.fromEntity(updatedComment);
}

export async function deleteComment(
    id: string,
    targetId: string,
    userId: string,
    target: 'Product' | 'Article',
) {
    const existingComment = await commentRepository.findCommentById(id, target);

    if (!existingComment) {
        throw new NotFoundError('Comment', Number(id));
    }
    if (existingComment.userId.toString() !== userId) {
        throw new ForbiddenError('본인의 댓글만 삭제할 수 있습니다.');
    }
    return await commentRepository.deleteComment(id, targetId, userId, target);
}

export async function getCommentList({
    id,
    cursor,
    limit,
    target,
}: {
    id: string;
    cursor: string;
    limit: number;
    target: 'Product' | 'Article';
}) {
    let commentsWithCursorComment;
    switch (target) {
        case 'Product':
            const existingProduct = await productRepository.findProductById({ productId: id });
            if (!existingProduct) {
                throw new NotFoundError('Product', Number(id));
            }
            commentsWithCursorComment = await commentRepository.findAllComments({
                cursor,
                limit,
                id,
                target,
            });
            break;
        case 'Article':
            const existingArticle = await articleRepository.findArticleById({ articleId: id });
            if (!existingArticle) {
                throw new NotFoundError('Article', Number(id));
            }
            commentsWithCursorComment = await commentRepository.findAllComments({
                cursor,
                limit,
                id,
                target,
            });
            break;
        default:
            if (!commentsWithCursorComment) throw new NotFoundError('Article', Number(id));
    }

    const comments = Comment.fromEntityList(commentsWithCursorComment.slice(0, limit));
    const cursorComment = commentsWithCursorComment[comments.length - 1];
    const nextCursor = cursorComment ? cursorComment.id : null;

    return { comments, nextCursor };
}
