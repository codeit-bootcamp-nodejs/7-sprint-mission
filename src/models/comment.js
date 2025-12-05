module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    { timestamps: true }
  );
  return Comment;
};
