import * as productsService from "../../src/services/productsService";
import * as productsRepository from "../../src/repositories/productsRepository";
import * as favoritesRepository from "../../src/repositories/favoritesRepository";
import * as notificationsService from "../../src/services/notificationsService";
import NotFoundError from "../../src/lib/errors/NotFoundError";

describe("Product 유닛 테스트", () => {
   afterEach(() => {
      jest.restoreAllMocks();
   });

   describe("updateProduct", () => {
      const productId = 1;
      const userId = 10;
      const updateData = { userId, price: 20000 };
      const mockExistingProduct = { id: productId, userId, price: 10000, name: "Old Product" };

      it("상품이 없으면 - NotFoundError", async () => {
         jest.spyOn(productsRepository, "getProduct").mockResolvedValue(null);

         await expect(productsService.updateProduct(productId, updateData)).rejects.toThrow(NotFoundError);
      });

      it("가격 변경 - notificationsService이 호출되어야 한다", async () => {
         jest.spyOn(productsRepository, "getProduct").mockResolvedValue(mockExistingProduct as any);
         jest.spyOn(productsRepository, "updateProductWithFavorites").mockResolvedValue({
            ...mockExistingProduct,
            price: 20000,
         } as any);
         jest
            .spyOn(favoritesRepository, "getFavoritesByProductId")
            .mockResolvedValue([{ userId: 100, productId }] as any);

         const notificationSpy = jest.spyOn(notificationsService, "createNotifications").mockResolvedValue([] as any);

         await productsService.updateProduct(productId, updateData);

         expect(notificationSpy).toHaveBeenCalled();
      });
   });
});
