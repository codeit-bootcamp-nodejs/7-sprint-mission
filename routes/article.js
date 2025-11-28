import express from "express";
import { prisma } from "../prisma/prisma.js";
// 라우터를 만드는 이유?
// 빈 객체 라우터를 만들어서 채워지면 export 라우터를 통해 이거 쓰세요~ 느낌.
const router = express.Router();

class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  // 파라미터 entity는 db객체를 끌어다 가져오는 파라미터임.
  // 그래서 가져온 db객체를 변환해주는 역할.
  static fromEntity(entity) {
    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.created_at
    );
  }
}

// 게시글 목록 조회 API를 만들어 주세요.
// id, title, content, createdAt를 조회합니다.
// todo: offset 방식의 페이지네이션 기능을 포함해 주세요.

function getFindOptionFrom(req) {
  // 최신순(recent)으로 정렬할 수 있습니다.
  // title, content에 포함된 단어로 검색할 수 있습니다.
  const findOption = {
    orderBy: { created_at: "desc" },
  };
  if (req.query.keyword) {
    findOption.where = {
      OR: [
        { title: { contains: req.query.keyword } },
        { content: { contains: req.query.keyword } },
      ],
    };
  }
  return findOption;
}

// 여기까지 들어온 거면 "/" 이여도 localhost:3000/api/aticles/ 이 URL인거임.
router.get("/", async (req, res, next) => {
  try {
    const findOption = getFindOptionFrom(req);
    // DB는 내 외부다.
    // article db에서 다 가져 와 대신 findOption 조건에 맞는 애들로.
    const entities = await prisma.article.findMany(findOption);
    // 가져온 애들을 fromEntity로 변환해서
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

// 위와 같은 코드이지만 promise 로 작성.
router.get("/:id", (req, res, next) =>
  Promise.resolve(getFindOptionFrom(req))
    .then(prisma.article.findMany)
    .then((entities) => entities.map(Article.fromEntity))
    .then(res.json)
    .catch((err) => {
      console.error(err);
      next(err);
    })
);

router.post("/", async (req, res, next) => {
  const { title, content } = req.body;
  try {
    const newPost = await prisma.article.create({
      data: {
        title: title,
        content: content,
      },
    });
    res.json(newPost);
  } catch (e) {
    console.log("Post 생성 중 오류", e);
    next(e);
  }
});

router.patch("/:id", async (req, res, next) => {
  // 1. URL 경로에서 수정 할 ID를 가져온다.
  const id = parseInt(req.params.id);

  // 2. 수정할 본문의 req.body 가져온다.
  const { title, content } = req.body;

  try {
    const updatePost = await prisma.article.update({
      // 어떤 경로의 ID인지 식별
      where: {
        id: id,
      },
      data: {
        title: title,
        content: content,
      },
    });
    res.json(updatePost);
  } catch (e) {
    console.error("Post 수정 중 오류");
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  // 1. URL 경로에서 삭제 할 ID를 가져온다.
  const id = parseInt(req.params.id);

  try {
    const deletedPost = await prisma.article.delete({
      where: {
        id: id,
      },
    });
    res.json(deletedPost);
  } catch (e) {
    console.error("Post 삭제 중 오류", e);
    next(e);
  }
});

export default router;
