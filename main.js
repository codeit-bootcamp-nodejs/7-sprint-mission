import { getProductList } from "./ProductService.js";
import { getArticleList } from "./ArticleService.js";

(async () => {
  try {
    console.log("--- 상품 목록 테스트 시작 ---");

    const productList = await getProductList({});

    console.log(productList);

    console.log("--- 게시글 목록 테스트 시작 ---");

    const articleList = await getArticleList({});

    console.log(articleList);
  } catch (e) {
    console.error("❌ 테스트 실행 중 최종 에러:", e.message);
  }
})();
