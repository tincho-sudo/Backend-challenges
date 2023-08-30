const Product = require("./models/product.model.js");
const { generateProductNotFoundError } = require("../../services/errors/info");
const CustomError = require("../../services/errors/CustomError.js");
const EErrors = require("../../services/errors/enums");
class ProductsDaoMongo {
  constructor() {}

  getAllProducts = async (queryOptions) => {
    try {
      let products;
      if (queryOptions !== undefined)
        products = await Product.find({ queryOptions });
      else products = await Product.find();
      return products;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getProductById = async (id) => {
    try {
      const product = await Product.findById(id);
      if (!product)
        CustomError.createError({
          name: "ProductError",
          cause: generateProductNotFoundError(id),
          message: "Product Error",
          code: EErrors.PRODUCT_ERROR,
        });
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  newProduct = async (product) => {
    try {
      const newProduct = await Product.create(product);
      return newProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateProduct = async (id, updatedFields, options) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updatedFields,
        options
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  deleteProductById = async (id) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  countDocuments = async (queryOptions = {}) => {
    try {
      const count = await Product.countDocuments(queryOptions);
      return count;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getProductsOrderedByCateg = async (categ) => {
    try {
      const products = await Product.find({ categ: categ }).collation({
        locale: "en",
        strength: 1,
      });
      return products;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getFilter = async () => {
    return Product.getFilter();
  };
}

module.exports = ProductsDaoMongo;
