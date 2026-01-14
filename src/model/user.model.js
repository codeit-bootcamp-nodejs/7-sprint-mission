export default class User {
  constructor(id, email, nickname, image, createdAt) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
    this.image = image;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new User(
      entity.id.toString(),
      entity.email,
      entity.nickname,
      entity.image ?? null,
      entity.createdAt.toISOString(),
    );
  }
}
