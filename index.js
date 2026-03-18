import { getProductList } from "../ProductService.js"; // 경로에 맞게 수정

async function test() {
  try {
    const list = await getProductList({ page: 110, pageSize: 111 });
    console.log("=== 가져온 상품 리스트 ===");
    console.log(list);
  } catch (err) {
    console.error("테스트 실패:", err.message);
  }
}

test();
