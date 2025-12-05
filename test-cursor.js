import { prisma } from "./prisma/prisma.js";
import {
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
  orderByToSort,
} from "./utils/cursor-pagination.js";

async function test() {
  try {
    // 1. Setup: Create Product and 2 comments
    const product = await prisma.product.create({
      data: { name: "CursorTest", price: 100 },
    });
    const id = product.id;
    console.log("Product ID:", id);

    const c1 = await prisma.comment.create({
      data: { content: "C1", productId: id },
    });
    await new Promise((r) => setTimeout(r, 100)); // Ensure time difference
    const c2 = await prisma.comment.create({
      data: { content: "C2", productId: id },
    });

    console.log("C1:", c1.id, c1.created_at);
    console.log("C2:", c2.id, c2.created_at);

    // 2. Fetch Page 1 (Limit 1)
    const take = 1;
    const orderBy = [{ created_at: "desc" }, { id: "desc" }];
    const sort = orderByToSort(orderBy);

    const page1 = await prisma.comment.findMany({
      where: { productId: id },
      take,
      orderBy,
    });

    console.log("Page 1 length:", page1.length);
    console.log("Page 1 Item:", page1[0].id);

    const lastItem = page1[page1.length - 1];
    // Simulate serialization/deserialization like in API
    // BigInt toJSON handling is assumed to be global in main.js, but here we must simulate it or manual conversion
    // In utils/cursor-pagination, createContinuationToken uses JSON.stringify.
    // We need to make sure BigInt is serializable.
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    const token = createContinuationToken(lastItem, sort);
    console.log("Token:", token);

    // 3. Fetch Page 2 using token
    const cursorData = parseContinuationToken(token);
    console.log("Cursor Data:", cursorData); // Will have strings for ID and Date

    const cursorWhere = buildCursorWhere(cursorData, sort);
    console.log("Cursor Where:", JSON.stringify(cursorWhere, null, 2));

    const page2 = await prisma.comment.findMany({
      where: {
        productId: id,
        ...cursorWhere,
      },
      take,
      orderBy,
    });

    console.log("Page 2 length:", page2.length);
    if (page2.length > 0) {
      console.log("Page 2 Item:", page2[0].id);
    } else {
      console.log("Page 2 is EMPTY!");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
