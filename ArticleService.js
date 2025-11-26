import { Article } from "./Article.js";

export class ArticleService {
  constructor() {
    this.articles = [];
  }

  addArticle(article) {
    if (article instanceof Article) {
      this.articles.push(article);
    }
  }

  getArticles() {
    return this.articles;
  }
}
