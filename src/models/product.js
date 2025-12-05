module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      price: { type: DataTypes.INTEGER, allowNull: false },
      tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    },
    { timestamps: true }
  );
  return Product;
};
