export class User {
  constructor(id, email, nickname, image, createdAt, updatedAt) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromEntity(entity) {
    return new User(
      entity.id.toString(),
      entity.email,
      entity.nickname,
      entity.image ?? null,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
