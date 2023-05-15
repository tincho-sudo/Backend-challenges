const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.counter = 1;
    // Lo unicializo asi porque en mi caso estoy usando subdirectorios por ahora para no hacer npm init en cada uno, no importa.
    this.directoryPath = "./Challenge-2/data";
    this.path = this.directoryPath + "/prod-data.json";
    // Crear el directorio si no existe
    if (!fs.existsSync(this.directoryPath)) {
      fs.mkdirSync(this.directoryPath);
    }

    this.getProductsFromFile();
  }

  // Agregar un nuevo producto
  addProduct(title, description, price, thumbnail, stock) {
    if (!title || !description || !price || !thumbnail || !stock) {
      throw new Error("Todos los campos del producto son obligatorios.");
    }
    const id = this.counter++;
    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      stock,
    };
    this.products.push(product);
    return product;
  }

  // Obtener un producto por su id
  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  // Actualizar los detalles de un producto
  updateProduct(id, updatedDetails) {
    const product = this.getProductById(id);

    if (!product) {
      throw new Error(`No se encontró ningún producto con el ID: ${id}`);
    } else {
      Object.assign(product, updatedDetails);
      return product;
    }
  }

  // Eliminar un producto por su id
  deleteProductById(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) {
      throw new Error(`No se encontró ningún producto con el ID: ${id}`);
    } else {
      return this.products.splice(productIndex, 1)[0];
    }
  }

  // Obtener todos los productos
  getAllProducts() {
    // llamo otra vez a fs.readFileSync en vez de reutilizar el de getProductsFromFile simplemente para no volver
    // a setear products y counter.
     
    const productsFile = fs.readFileSync(this.path, "utf-8");
    console.log(productsFile);
    if (this.products.length != 0) return this.productsFile;
    return "No hay productos";
  }

  setProductsFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  getProductsFromFile() {
    try {
      const productsFile = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(productsFile);
      this.counter = this.products.length + 1;
    } catch (error) {
      // Si hay algun error o no existe, se inicializa de 0 todo
      this.products = [];
      this.counter = 1;
      fs.writeFileSync(this.path, "[]");
    }
  }
}

module.exports = { ProductManager };
