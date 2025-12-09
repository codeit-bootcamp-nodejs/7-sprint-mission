// Sequelize 초기화 & 모델 연결
Product.hasMany(Comment, { foreignKey: "productId", onDelete: "CASCADE" });
Comment.belongsTo(Product, { foreignKey: "productId" });

Article.hasMany(Comment, { foreignKey: "articleId", onDelete: "CASCADE" });
Comment.belongsTo(Article, { foreignKey: "articleId" });
