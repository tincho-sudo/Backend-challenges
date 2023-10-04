const ProductsDao = require("../products.mongo");

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
  async newProduct(product) {
    // return async (req, res) => {
    console.log(product);
    //    if (req.user.role === "admin") {
    await this.dao.newProduct(product);
    const addedProduct = await this.dao.newProduct(product);
    return addedProduct;
    //   res.status(200).json({
    //     success: true,
    //     message: "Product created",
    //     product: addedProduct,
    //  });
    //     } else {
    //       res.status(403).json({ success: false, error: "Unauthorized" });
    //     }
    //};
  }

  updateProductById(id, updatedFields, options) {
    return async (req, res) => {
      if (req.user.role === "admin") {
        await this.dao.updateProductById(id, updatedFields, options);
        res.status(200).json({ success: true, message: "Product created" });
      } else {
        res.status(403).json({ success: false, error: "Unauthorized" });
      }
    };
  }

  deleteProductById(id) {
    return async (req, res) => {
      if (req.user.role === "admin") {
        res.status(200).json({ success: true, message: "Product created" });
        await this.dao.deleteProductById(id);
      } else {
        res.status(403).json({ success: false, error: "Unauthorized" });
      }
    };
  }

  countDocuments(queryOptions) {
    return this.dao.countDocuments(queryOptions);
  }

  getProductsOrderedByCateg(categ) {
    return this.dao.getProductsOrderedByCateg(categ);
  }

  getFilter() {
    return this.dao.getFilter();
  }

}

module.exports = ProductsService;
