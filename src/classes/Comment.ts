import { BaseCommentParam, CommentData } from '../lib/types/commentType';

export class Comment {
    readonly id: string;
    readonly userId: string;
    readonly content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor({ id, userId, content, createdAt, updatedAt }: BaseCommentParam) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(comment: CommentData | null): Comment {
        if (!comment) throw new Error('데이터가 존재하지 않습니다.');
        return new Comment({
            id: comment.id.toString(),
            userId: comment.userId.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        });
    }
    static fromEntityList(comments: CommentData[] = []): Comment[] {
        return comments.map(Comment.fromEntity);
    }
}
