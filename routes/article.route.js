import { Article, UnregisteredArticle } from "./article.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import articleCommentRouter from "./article-comment.route.js";

// 라우터를 만드는 이유?
// 빈 객체 라우터를 만들어서 채워지면 export 라우터를 통해 이거 쓰세요~ 느낌.
const articleRouter = new Router();

// articleId/comments 로 들어오면 articleCommentRouter로 넘긴다.
articleRouter.use("/:articleId/comments", articleCommentRouter);

// 여기까지 들어온 거면 "/" 이여도 localhost:3000/api/aticles/ 이 URL인거임.
articleRouter.get("/", validateGetArticles, async (req, res, next) => {
  try {
    // findOption에 유효성 검사를 마친 req를 담는다.
    // req.query를 하게 되면 문자열로 받은 쿼리파라미터를 자바스크립트 객체형태로 바꿔줌.
    const findOption = getFindArticleOption(req.query);
    // DB는 내 외부다.
    // article db에서 다 가져 와 대신 findOption 조건에 맞는 애들로.
    const entities = await prisma.article.findMany(findOption);
    // 가져온 배열 애들을 fromEntity로 변환해서
    const articles = entities.map(Article.fromEntity);
    // JSON객체로 담아서 응답.
    res.json(articles);
    // 근데 에러 뜨면?
  } catch (e) {
    // 콘솔 찍고
    console.error(e);
    // next로 에러 넘겨.
    next(e);
  }
});

// 특정 게시글 조회 (404 예시)
articleRouter.get("/:id", validateGetArticle, async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    const entity = await prisma.article.findUnique({
      where: { id: articleId },
    });

    // 게시글이 없으면 404 에러
    if (!entity) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    res.json(Article.fromEntity(entity));
  } catch (e) {
    next(e);
  }
});

articleRouter.post("/", validatePostArticle, async (req, res, next) => {
  try {
    // 유효성 검사를 하고 통과한 info.title, info.content를 반환해주는 로직
    const unregistered = UnregisteredArticle.fromInfo(req.body);
    // 객체에서 title과 content 속성 추출
    const { title, content } = unregistered;
    const newEntity = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    const newPost = Article.fromEntity(newEntity);
    res.json(newPost);
  } catch (e) {
    console.log("Post 생성 중 오류", e);
    next(e);
  }
});

articleRouter.patch("/:id", validatePatchArticle, async (req, res, next) => {
  try {
    // 1. URL 경로에서 수정 할 ID를 가져온다.
    const { id } = req.params;
    const articleId = parseInt(id);
    // 2. 수정할 본문의 req.body 가져온다.
    const unregistered = UnregisteredArticle.fromInfo(req.body);
    const { title, content } = unregistered;
    const updateEntity = await prisma.article.update({
      // 어떤 경로의 ID인지 식별
      where: {
        id: articleId,
      },
      data: {
        title,
        content,
      },
    });
    const updatePost = Article.fromEntity(updateEntity);
    res.json(updatePost);
  } catch (e) {
    console.error("Post 수정 중 오류");
    next(e);
  }
});

articleRouter.delete("/:id", validateDeleteArticle, async (req, res, next) => {
  try {
    // 1. URL 경로에서 삭제 할 ID를 가져온다.
    const { id } = req.params;
    const articleId = parseInt(id);
    const deletedEntity = await prisma.article.delete({
      where: {
        id: articleId,
      },
    });
    const deletedPost = Article.fromEntity(deletedEntity);
    res.json(deletedPost);
  } catch (e) {
    console.error("Post 삭제 중 오류", e);
    next(e);
  }
});

// ------------------------유효성 검사-------------------------------------
function getFindArticleOption(keyword, page = "1", limit = "10") {
  // 최신순(recent)으로 정렬할 수 있습니다.
  // title, content에 포함된 단어로 검색할 수 있습니다.
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  // parseInt로 넘버가 들어오지 않은 상황이면
  if (isNaN(skip) || isNaN(take)) {
    throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
  }

  const option = {
    skip,
    take,
    orderBy: [{ create_at: "desc" }, { id: "asc" }],
  };

  if (keyword) {
    option.where = {
      OR: [
        {
          title: {
            contains: keyword,
          },
        },
        {
          content: {
            contains: keyword,
          },
        },
      ],
    };
  }
  return option;
}

export default articleRouter;

//-----------------미들웨어 유효성 검사--------------------------------

function validateDeleteArticle(req, res, next) {
  // ID 유효성 검사 추가
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
  }
  next();
}
function validatePatchArticle(req, res, next) {
  // ID 유효성 검사 추가
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
  }
  next();
}
function validateGetArticles(req, res, next) {
  next();
}
function validateGetArticle(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new BadRequestError("id가 왜 이럼??");
  next();
}
function validatePostArticle(req, res, next) {
  next();
}
