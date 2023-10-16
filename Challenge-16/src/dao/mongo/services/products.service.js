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
    //return async (req, res) => {
    //  if (req.user.role === "admin") {
    const addedProduct = await this.dao.newProduct(product);
    return addedProduct;
    // res.status(201).json({
    //     success: true,
    //     message: "Product created",
    //     product: addedProduct,
    //   });
    // } else {
    //    res.status(403).json({ success: false, error: "Unauthorized" });
    //  }
    // };
  }

  async updateProductById(id, updatedFields, options) {
    try {
      const updatedProduct = await this.dao.updateProductById(
        id,
        updatedFields,
        options
      );

      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const deletedProduct = await this.dao.deleteProductById(id);

      if (!deletedProduct) {
        return null; // No se encontró el producto
      }

      return deletedProduct;
    } catch (error) {
      throw error;
    }
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
