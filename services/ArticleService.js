import { Article } from "../models/Article.js";


export class ArticleService {
  constructor() {
    this.articles = [];
  }

  createArticle(title, content, tags = [], images = []) {
    const article = new Article(title, content, tags, images);
    this.articles.push(article);
    return article;
  }

  getArticles() {
    return this.articles;
  }

  getArticleByIndex(index) {
    return this.articles[index] ?? null;
  }

  likeArticle(index) {
    const article = this.getArticleByIndex(index);
    if (!article) return null;
    article.like();
    return article;
  }
}
