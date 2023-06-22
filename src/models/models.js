const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  password: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false }
})

const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.INTEGER, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false }
})

const Characteristic = sequelize.define("characteristic", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false }
})

User.hasMany(Product);
Product.belongsTo(User);

Product.hasMany(Characteristic);
Characteristic.belongsTo(Product);

module.exports = {
  User,
  Product,
  Characteristic
}

