export class Article {
  #likeCount;
  //     - Article 클래스는 `title`(제목), `content`(내용), `writer`(작성자), `likeCount`(좋아요 수) 프로퍼티를 가집니다.
  constructor(title, content, image) {
    this.title = title;
    this.content = content;
    this.image = image;
    this.createdAt = new Date();
    this.#likeCount = 0;
  }
  //     - Article 클래스는 `like` 메소드를 가집니다. `like` 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
  like() {
    this.#likeCount++;
  }

  get likeCount() {
    // getter 숨겨둔 내부 상태를 보여줄 필요가 있을때
    return this.#likeCount;
  }

  static of({ title, content, image }) {
    return new Article(title, content, image);
  }
}
