 CREATE TABLE users (
	id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  provider VARCHAR(50), 
  provider_id VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );

CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),  
  name VARCHAR(100) NOT NULL CONSTRAINT name_length CHECK (LENGTH(name) >=10),
  description TEXT  NOT NULL CONSTRAINT description_length CHECK (LENGTH(description) >=10),
  price INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tags(
 	id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL CONSTRAINT tag_length CHECK (LENGTH(name) >=5)
);
  
CREATE TABLE product_tags(
  id SERIAL PRIMARY KEY,
  tag_id  INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_images(
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    src TEXT NOT NULL
);

CREATE TABLE articles(
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
); 
CREATE TABLE article_images(
    id SERIAL PRIMARY KEY,
    article_id  INT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    src TEXT
);
CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    article_id INT REFERENCES articles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()

);
CREATE TABLE favorites(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE

);
CREATE TABLE likes(
	id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    article_id INT NOT NULL REFERENCES articles(id) ON DELETE CASCADE

);
