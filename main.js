import { Product, ElectronicProduct } from "./Product.js";
import { Article, NewsArticle } from "./Article.js";
import { ProductService } from "./ProductService.js";
import { ArticleService } from "./ArticleService.js";

const productService = new ProductService();
const articleService = new ArticleService();

const product = new Product("Keyboard", "Mechanical keyboard", 50);
const electronic = new ElectronicProduct(
  "Monitor",
  "4K monitor",
  300,
  [],
  [],
  "LG"
);

productService.addProduct(product);
productService.addProduct(electronic);
product.favorite();
product.favorite();

console.log("Products:", productService.getProducts());

const article = new Article("Hello", "This is content");
const news = new NewsArticle("Breaking News", "Some news", [], [], "BBC");

articleService.addArticle(article);
articleService.addArticle(news);
article.like();

console.log("Articles:", articleService.getArticles());
