import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";

class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }
  favorite() {
    this.favoriteCount++;
  }
}

class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer
  ) {
    super(name, description, price, tags, images, favoriteCount);

    this.manufacturer = manufacturer;
  }
}

class Article {
  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date();
  }
  like() {
    this.likeCount++;
  }
}

let products = [];

async function loadAndInstantiateProducts() {
  console.log("--- 상품 데이터 로딩 시작 ---");
  const productData = await getProductList(1, 10, "");

  if (productData && productData.list && productData.list.length > 0) {
    products = productData.list.map((data) => {
      const isElectronic = data.tags && data.tags.includes("전자제품");
      if (isElectronic) {
        return new ElectronicProduct(
          data.name,
          data.description,
          data.price,
          data.tags,
          data.images,
          data.favoriteCount,
          "제조사 미상"
        );
      } else {
        return new Product(
          data.name,
          data.description,
          data.price,
          data.tags,
          data.images,
          data.favoriteCount
        );
      }
    });

    console.log(`\n ${products.length}개의 Product 인스턴스 생성 완료.`);

    const electronicExample = products.find(
      (p) => p instanceof ElectronicProduct
    );
    console.log(`- 첫 번째 인스턴스의 타입: ${products[0].constructor.name}`);
    if (electronicExample) {
      console.log(
        `- 전자제품 인스턴스 확인: ${electronicExample.constructor.name}`
      );
    }
  } else {
    console.log(" 불러올 상품 데이터가 없거나 오류가 발생했습니다.");
  }
}

async function runTests() {
  console.log("--- Product API 테스트 ---");
  await loadAndInstantiateProducts();

  const newProd = await createProduct(
    "테스트 상품",
    "설명",
    10000,
    ["테스트"],
    []
  );

  if (newProd) {
    const newProdId = newProd.id;
    console.log(`새 상품 ID: ${newProdId}`);

    await getProduct(newProdId);
    await patchProduct(newProdId, { name: "수정된 테스트 상품" });
    await deleteProduct(newProdId);
  }

  console.log("\n--- Article API 테스트 ---");
  await getArticleList(1, 2, "test");

  const newArticle = await createArticle(
    "테스트 제목",
    "테스트 내용",
    "https://placehold.co/600x400"
  );

  if (newArticle) {
    const newArticleId = newArticle.id;
    console.log(`새 게시글 ID: ${newArticleId}`);

    await getArticle(newArticleId);
    await patchArticle(newArticleId, { title: "수정된 테스트 제목" });
    await deleteArticle(newArticleId);
  }
}

runTests();
