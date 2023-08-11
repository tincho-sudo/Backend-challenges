const ProductsDao = require("../dao/mongo/products.mongo.js");

class ProductsService {
  constructor() {
    this.dao = new ProductsDao();
  }

  getAllProducts(queryOptions) {
    return this.dao.getAllProducts(queryOptions);
  }

  getProductById(id) {
    return this.dao.getProductById(id);
  }
  newProduct(product) {
    return this.dao.newProduct(product);
  }

  updateProductById(id, updatedFields, options) {
    return this.dao.updateProductById(id, updatedFields, options);
  }

  deleteProductById(id) {
    return this.dao.deleteProductById(id);
  }

  countDocuments(queryOptions) {
    return this.dao.countDocuments(queryOptions);
  }

  getProductsOrderedByCateg(categ) {
    return this.dao.getProductsOrderedByCateg(categ);
  }

  getFilter(){
    return this.dao.getFilter();
  }
}

module.exports = ProductsService;
