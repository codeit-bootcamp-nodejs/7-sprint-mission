import * as articlesService from "../../src/services/articlesService";
import * as articlesRepository from "../../src/repositories/articlesRepository";
import NotFoundError from "../../src/lib/errors/NotFoundError";
import ForbiddenError from "../../src/lib/errors/ForbiddenError";

describe("Articles 유닛 테스트", () => {
   afterEach(() => {
      jest.restoreAllMocks();
   });

   describe("deleteArticle", () => {
      it("존재하지 않는 게시글 삭제 - NotFoundError", async () => {
         jest.spyOn(articlesRepository, "getArticle").mockResolvedValue(null);

         await expect(articlesService.deleteArticle(999, 1)).rejects.toThrow(NotFoundError);
      });

      it("작성자가 아닌 사용자가 삭제 - ForbiddenError", async () => {
         const mockArticle = { id: 1, userId: 10 };
         jest.spyOn(articlesRepository, "getArticle").mockResolvedValue(mockArticle as any);

         await expect(articlesService.deleteArticle(1, 99)).rejects.toThrow(ForbiddenError);
      });

      it("정상적인 삭제 요청 - repository의 delete 메서드가 호출", async () => {
         const mockArticle = { id: 1, userId: 10 };
         jest.spyOn(articlesRepository, "getArticle").mockResolvedValue(mockArticle as any);
         const deleteSpy = jest.spyOn(articlesRepository, "deleteArticle").mockResolvedValue(undefined as any);

         await articlesService.deleteArticle(1, 10);

         expect(deleteSpy).toHaveBeenCalledWith(1);
      });
   });
});
