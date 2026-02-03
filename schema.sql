// 게시글 등록시 제목 내용  이미지 
// 게시글 좋아요 댓글 가능
// 유저 로그인시 이메일 닉네임 비밀번호 
// 상품 등록 이미지  상품명 상품소개 판매가격 태그 
// 상품 조회시 좋아요 댓글 가능 


CREATE TABLE  users (
    id SERIAL PRIMARY KEY,
    email   VARCHAR(200) UNIQUE NOT NULL,
    nickname VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_id TIMESTAMP DEFAULT NOW(),
    update_id TIMESTAMP DEFAULT NOW()
)

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price BIGINT,
    image TEXT NOT NULL,
    created_id TIMESTAMP DEFAULT NOW(),
    update_id TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    image TEXT,
    tag VARCHAR(100),
    created_id TIMESTAMP DEFAULT NOW(),
    update_id TIMESTAMP DEFAULT NOW()
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    writer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE articles_likes (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, article_id)
)

CREATE TABLE product_likes (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE product_tags (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);