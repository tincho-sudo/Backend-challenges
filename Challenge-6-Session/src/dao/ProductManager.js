const fs = require("fs");
const Product = require("../dao/models/product.model.js");
class ProductManager {
  constructor(io, productId) {
    this.products = [];
    this.io = io;
    this.productId = productId;
    // Lo unicializo asi porque en mi caso estoy usando subdirectorios por ahora para no hacer npm init en cada uno, no importa.
    this.directoryPath = "../Challenge-6-Session/data";
    this.path = this.directoryPath + "/prod-data.json";
    // Crear el directorio si no existe
    if (!fs.existsSync(this.directoryPath)) {
      fs.mkdirSync(this.directoryPath);
    }
  }

  // Agregar un nuevo producto
  async addProduct(productData, productId) {
    try {
      const { title, description, price, thumbnail, stock } = productData;
      if (!title || !description || !price || !thumbnail || !stock) {
        throw new Error("Todos los campos del producto son obligatorios.");
      }
      const product = {
        _id: productId,
        title,
        description,
        price,
        thumbnail,
        stock,
      };

      this.products.push(product);
      console.log(product);
      await this.setProductsFile(); // Guardar los cambios en el archivo
      this.io.emit("productCreated", product);
      return product;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  // Obtener un producto por su id, cargo el json por si hubo algun update antes
  async getProductById(id) {
    try {
      await this.getProductsFromFile(); // Cargar los productos desde el archivo

      const product = this.products.find((product) => product._id === id);
      if (!product) {
        throw new Error(`No se encontró ningún producto con el ID: ${id}`);
      } else {
        console.log(product);
        return product;
      }
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      throw error;
    }
  }

  // Actualizar los detalles de un producto, guardo el json
  async updateProduct(id, updatedDetails) {
    try {
      const product = this.getProductById(id);

      if (!product) {
        throw new Error(`No se encontró ningún producto con el ID: ${id}`);
      } else {
        Object.assign(product, updatedDetails);
        await this.setProductsFile(); // Guardar los cambios en el archivo
        return product;
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  // Eliminar un producto por su id, despues modifico el json
  async deleteProductById(id) {
    try {
      await this.getProductsFromFile();
      const productIndex = this.products.findIndex(
        (product) => product._id === id
      );
      if (productIndex === -1) {
        throw new Error(`No se encontró ningún producto con el ID: ${id}`);
      } else {
        const deletedProduct = this.products.splice(productIndex, 1)[0];
        await this.setProductsFile(); // Guardar los cambios en el archivo JSON
        this.io.emit("productDeleted", deletedProduct);
        console.log(deletedProduct);
        return deletedProduct;
      }
    } catch (error) {
      console.error(error);
      throw error; // Lanzar la excepción para que se detecte el error en otros lugares
    }
  }

  // Funcion para reescribir el json con las modificaiones, inserciones o eliminaciones de datos
  async setProductsFile() {
    try {
      const products = await Product.find(); // Obtener todos los productos de la base de datos

      await fs.promises.writeFile(this.path, JSON.stringify(products));
      this.products = products;
    } catch (error) {
      console.error("Error al escribir en el archivo de productos:", error);

      throw error;
    }
  }

  async getProductsFromFile() {
    try {
      const productsFile = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(productsFile);
      return this.products;
    } catch (error) {
      console.error("Error al leer el archivo de productos:", error);
      console.error("Recuperando desde la base de datos...");
      const products = await Product.find(); // Obtener todos los productos de la base de datos
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      this.products = JSON.parse(products);
      return this.products;
    }
  }
  // Obtener todos los productos
  // llamo otra vez a fs.readFileSync en vez de reutilizar el de getProductsFromFile simplemente para no volver
  // a setear products y counter.
  async getAllProducts(limit) {
    try {
      await this.getProductsFromFile();
      if (this.products.length === 0) {
        return [];
      }
      if (limit) {
        return this.products.slice(0, limit);
      } else {
        return this.products;
      }
    } catch (error) {
      console.error(error);
      throw error; // Lanzar la excepción para que se detecte el error en otros lugares
    }
  }
}

module.exports = { ProductManager };
