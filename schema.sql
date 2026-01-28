CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    provider VARCHAR(20),
    provider_id VARCHAR(50) UNIQUE,
    nickname VARCHAR(20)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(30) NOT NULL CHECK (LENGTH(name) >= 10),
    description TEXT NOT NULL CHECK (LENGTH(description) >= 10),
    price INTEGER NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    url TEXT NOT NULL,
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL CHECK (LENGTH(name) >= 5),
);

CREATE TABLE product_tags (
    product_id INTEGER NOT NULL REFERENCES products(id),
    tag_id INTEGER NOT NULL REFERENCES tags(id),
);

CREATE TABLE article_tags (
    article_id INTEGER NOT NULL REFERENCES articles(id),
    tags_id INTEGER NOT NULL REFERENCES tags(id),
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TABLE article_images (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES articles(id),
    url TEXT NOT NULL,
);

CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    article_id INTEGER REFERENCES articles(id),
    content TEXT NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TABLE favorites (
    product_id INTEGER NOT NULL REFERENCES products(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
);

CREATE TABLE likes (
    article_id INTEGER NOT NULL REFERENCES articles(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
);