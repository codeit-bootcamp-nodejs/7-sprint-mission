CREATE TYPE product_status AS ENUM ('판매중', '판매완료')

-- 유저 테이블
CREATE TABLE users (
    id           SERIAL PRIMARY KEY,
    email        VARCHAR(255) UNIQUE,
    password     VARCHAR(255),
    provider     VARCHAR(50),
    provider_id  VARCHAR(255),
    nickname     VARCHAR(50) NOT NULL UNIQUE,
    image        VARCHAR(255),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),

   CONSTRAINT uq_users_provider_provider_id UNIQUE (provider, provider_id)
);

-- 카테고리 테이블
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 상품 테이블
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER DEFAULT 0,
    status product_status DEFAULT '판매중', -- 판매중, 판매완료 등
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_products_price  CHECK (price >= 0),
    CONSTRAINT chk_products_view   CHECK (view_count >= 0)
);

-- 상품 이미지 테이블
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    image_order INTEGER DEFAULT 1,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_images_order UNIQUE (product_id, image_order)
);

-- 상품 댓글 테이블
CREATE TABLE product_comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- 상품 찜 테이블
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_favorites_user_product UNIQUE (user_id, product_id)
);

-- 게시글 테이블
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- 게시글 이미지 테이블
CREATE TABLE article_images (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    image_order INTEGER DEFAULT 1,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_article_images_order UNIQUE(article_id, image_order)
);

-- 게시글 좋아요 테이블
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_likes_user_article UNIQUE(user_id, article_id)
);

-- 게시글 댓글 테이블
CREATE TABLE article_comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_articles_user_id ON articles(user_id);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_article_images_article_id ON article_images(article_id);

CREATE UNIQUE INDEX uq_product_main_image ON product_images(product_id) WHERE is_main = TRUE;
CREATE UNIQUE INDEX uq_article_main_image ON article_images(article_id) WHERE is_main = TRUE;