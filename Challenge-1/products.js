class ProductManager {
  constructor() {
    this.products = [];
    this.counter = 1;
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
    const product = this.getProductById(id);
    if (!product) {
      throw new Error(`No se encontró ningún producto con el ID: ${id}`);
    } else {
      return this.products.splice(id, 1)[0];
    }
  }

  // Obtener todos los productos
  getAllProducts() {
    if (this.products.length != 0) return this.products;
    return "No hay productos";
  }
}

module.exports = { ProductManager};
