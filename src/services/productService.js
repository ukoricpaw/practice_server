const deleteAsync = require("../files/asyncFiles");
const path = require("path");
const staticPath = path.resolve(__dirname, "..", "static");
const uuid = require("uuid");
const { Characteristic, Product, User } = require("../models/models");
const { Op } = require("sequelize");

class ProductService {
  async create(name, price, img, userId) {
    const fileName = uuid.v4() + ".jpg";
    await img.mv(path.resolve(staticPath, fileName));
    const product = await Product.create({
      name,
      price,
      img: fileName,
      userId: userId,
    });
    return product;
  }

  async addChars(id, userId, characteristics) {
    const product = await Product.findOne({ where: { id } });
    if (!product || product.userId !== userId) {
      return null;
    }
    characteristics.forEach(async (chars) => {
      if (chars.value && chars.name) {
        await Characteristic.create({
          name: chars.name,
          value: chars.value,
          productId: id,
        });
      }
    });
    return product;
  }

  async updateProduct(id, userId, name, files, price) {
    const product = await Product.findOne({ where: { id } });
    if (!product || userId !== product.userId) {
      return null;
    }
    if (files) {
      const { img } = files;
      let fileName = uuid.v4() + ".jpg";
      await img.mv(path.resolve(staticPath, fileName));
      await deleteAsync(product.img);
      product.img = fileName;
    }
    product.name = name || product.name;
    product.price = price || product.price;
    await product.save();
    return product;
  }

  async getOneProduct(id) {
    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: Characteristic,
          as: "characteristics",
          required: false,
        },
      ],
    });
    if (!product) {
      return null;
    }
    return product;
  }

  async getAllProducts(limit, offset, sorted, search) {
    let products;
    if (sorted === "ASC") {
      products = await Product.findAndCountAll({
        order: [["price", "ASC"]],
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        limit,
        offset,
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
      });
    } else {
      products = await Product.findAndCountAll(
        {
          order: [["price", "DESC"]],
          where: {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          limit,
          offset,
          include: [
            {
              model: User,
              as: "user",
              attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
              },
            },
          ],
        },
        limit,
        offset
      );
    }
    return products;
  }

  async userProducts(id, limit, offset, sorted, search) {
    let products;
    if (sorted === "ASC") {
      products = await Product.findAndCountAll({
        order: [["price", "ASC"]],
        where: {
          userId: id,
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        limit,
        offset,
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
      });
    } else {
      products = await Product.findAndCountAll(
        {
          order: [["price", "DESC"]],
          where: {
            userId: id,
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          limit,
          offset,
          include: [
            {
              model: User,
              as: "user",
              attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
              },
            },
          ],
        },
        limit,
        offset
      );
    }
    return products;
  }

  async updateCharacteristic(id, userId, name, value) {
    const statistic = await Characteristic.findOne({
      where: { id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!statistic || statistic.product.userId !== userId) {
      return null;
    }
    statistic.name = name || statistic.name;
    statistic.value = value || statistic.value;
    await statistic.save();
    return statistic;
  }

  async deleteCharacteristic(id, userId) {
    const statistic = await Characteristic.findOne({
      where: { id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!statistic || statistic.product.userId !== userId) {
      return null;
    }
    await statistic.destroy();
    return { message: "deleted" };
  }

  async deleteProduct(id, userId) {
    const product = await Product.findOne({ where: { id } });
    if (!product || product.userId !== userId) {
      return null;
    }
    const characteristics = await Characteristic.findAll({
      where: { productId: product.id },
    });
    if (characteristics) {
      characteristics.forEach(async (chars) => {
        await chars.destroy();
      });
    }
    await deleteAsync(product.img);
    await product.destroy();
    return { message: "deleted" };
  }
}

module.exports = new ProductService();
