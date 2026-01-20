import { ArticleData, ArticleParam } from '../lib/types/articleType';

export class Article {
    readonly id: string;
    readonly userId: string;
    readonly title: string;
    readonly content: string;
    readonly image: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor({ id, title, content, image, createdAt, updatedAt, userId }: ArticleParam) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(article: ArticleData): Article {
        if (!article) throw new Error('데이터가 존재하지 않습니다.');
        return new Article({
            id: article.id.toString(),
            userId: article.userId.toString(),
            title: article.title,
            content: article.content,
            image: article.image,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
        });
    }
    static fromEntityList(articles: ArticleData[] = []): Article[] {
        return articles.map(Article.fromEntity);
    }
}
