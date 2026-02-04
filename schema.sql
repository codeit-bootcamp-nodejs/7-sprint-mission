/* 숫자 타입
INT	          정수 (약 -21억 ~ 21억)	    ID, 수량, 가격 등
BIGINT	      큰 정수	                   데이터가 아주 많은 테이블의 PK(ID)
DECIMAL(p,s)  고정 소수점 (정확한 수치)    	   돈, 금융 데이터 (오차 없어야 함)
FLOAT / DOUBLE	부동 소수점 (근사치)	      과학적 계산, 통계 데이터

* 문자타입
CHAR(n)	      고정 길이 문자열	             고정된 코드 (예: 'Y/N', 국가코드 'KR')
VARCHAR(n)	  가변 길이 문자열	             이름, 제목, 이메일 (가장 많이 사용)
TEXT	      긴 문자열 (최대 65,535자)	     게시글 본문, 상세 설명
LONGTEXT	  매우 긴 문자열	            대용량 텍스트 데이터

* 날짜 및 시간
DATE	      날짜만 표시 (YYYY-MM-DD)       생년월일, 기념일
DATETIME	  날짜 + 시간	                게시글 작성 시간, 로그 기록
TIMESTAMP	  날짜 + 시간 (자동 변환)	      시스템 변경 시점 기록 (UTC 기준)
*/

-- 사용자
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    nickname VARCHAR(12) NOT NULL,
    password TEXT,
    provider VARCHAR(20) NOT NULL DEFAULT 'local',
    social_id VARCHAR(255),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

-- 상품
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tags JSON,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,

    CONSTRAINT fk_products_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 게시글
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,

    CONSTRAINT fk_articles_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 댓글
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    user_id INT,
    product_id INT,
    article_id INT,

    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_article_id FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- 상품 찜하기
CREATE TABLE product_wishes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    product_id INT NOT NULL,

    CONSTRAINT unique_user_product_wish UNIQUE (user_id, product_id),
    CONSTRAINT fk_wishes_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishes_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 게시글 좋아요
CREATE TABLE article_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    article_id INT NOT NULL,

    CONSTRAINT unique_user_article_like UNIQUE (user_id, article_id),
    CONSTRAINT fk_likes_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_article_id FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- 이미지 등록
CREATE TABLE images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    product_id INT,
    article_id INT,

    CONSTRAINT fk_image_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_image_article_id FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

