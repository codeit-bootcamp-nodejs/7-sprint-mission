export class Article {
  constructor(title, content, tags = [], images = []) {
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.images = images;
    this.likeCount = 0;
  }

  like() {
    this.likeCount += 1;
  }
}
