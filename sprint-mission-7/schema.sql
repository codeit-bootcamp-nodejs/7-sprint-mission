DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS article_likes CASCADE;
DROP TABLE IF EXISTS product_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  nickname     TEXT NOT NULL UNIQUE,
  image        TEXT,
  password     TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       INT NOT NULL CHECK (price >= 0),
  tags        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

  user_id     BIGINT NOT NULL,
  CONSTRAINT fk_products_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE articles (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ(6),

  user_id     BIGINT NOT NULL,
  CONSTRAINT fk_articles_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE comments (
  id          BIGSERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ(6),

  user_id     BIGINT NOT NULL,
  product_id  BIGINT,
  article_id  BIGINT,

  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,

  CONSTRAINT fk_comments_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

  CONSTRAINT fk_comments_article
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

ALTER TABLE comments
ADD CONSTRAINT chk_comments_target_one
CHECK (
  (product_id IS NOT NULL AND article_id IS NULL)
  OR
  (product_id IS NULL AND article_id IS NOT NULL)
);

CREATE TABLE product_likes (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  product_id  BIGINT NOT NULL,
  created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_product_likes_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_product_likes_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

  CONSTRAINT uq_product_likes_user_product UNIQUE (user_id, product_id)
);

CREATE TABLE article_likes (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  article_id  BIGINT NOT NULL,
  created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_article_likes_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_article_likes_article
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,

  CONSTRAINT uq_article_likes_user_article UNIQUE (user_id, article_id)
);

CREATE TABLE refresh_tokens (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ(6) NOT NULL,
  revoked_at  TIMESTAMPTZ(6),
  created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

CREATE INDEX idx_products_user_created_at ON products(user_id, created_at DESC);
CREATE INDEX idx_articles_user_created_at ON articles(user_id, created_at DESC);

CREATE INDEX idx_product_likes_user_created_at ON product_likes(user_id, created_at DESC);
CREATE INDEX idx_product_likes_product_id ON product_likes(product_id);

CREATE INDEX idx_article_likes_user_created_at ON article_likes(user_id, created_at DESC);
CREATE INDEX idx_article_likes_article_id ON article_likes(article_id);

CREATE INDEX idx_comments_product_created_at ON comments(product_id, created_at DESC);
CREATE INDEX idx_comments_article_created_at ON comments(article_id, created_at DESC);
