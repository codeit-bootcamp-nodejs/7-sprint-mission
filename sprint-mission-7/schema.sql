-- 로그인, 회원가입 - 이메일-unique, 닉네임, 비밀번호(8자 이상 - 확인도), 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 8),
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
)
-- 상품 -  상품명(10자 이내), 상품 소개(10자 이상), 판매가격(숫자로만), 좋아요 수
  -- 태그(5글자 이내, 여러개 가능)
  -- 사진(없으면 기본 이미지, 최대 1개),
  -- 상품 상세 페이지 - 이미지, 상품명, 상품 가격, 상품 소개, 상품 태그, 닉네임, 좋아요, 답글(여러개, 수정, 삭제 가능)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(10) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) >= 10),
  price INTEGER NOT NULL CHECK (price >= 0),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
)

-- 게시글 - 제목, 내용, 이미지, 좋아요, 최신 순,// 답글, 닉네임, 등록날짜, 태그 없음?
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
)

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE, 
    image_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE article_images (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- 댓글 - 게시글/상품 번호, 작성자, 댓글 내용, 작성 시간
CREATE TABLE product_comments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE article_comments (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE product_likes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE article_likes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, article_id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(5) UNIQUE NOT NULL
);

CREATE TABLE product_tags (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);
-- 게시글 태그 없음