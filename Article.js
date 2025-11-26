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

export class NewsArticle extends Article {
  constructor(title, content, tags = [], images = [], press) {
    super(title, content, tags, images);
    this.press = press;
  }
}
