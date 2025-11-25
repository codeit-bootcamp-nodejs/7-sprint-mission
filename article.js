export class Article {
  #likeCount;
  constructor(title, content, image) {
    this.title = title;
    this.content = content;
    this.image = image;
    this.createdAt = new Date();
    this.#likeCount = 0;
  }
  like() {
    this.#likeCount++;
  }

  get likeCount() {
    return this.#likeCount;
  }

  static of({ title, content, image }) {
    return new Article(title, content, image);
  }
}
