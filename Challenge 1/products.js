class ProductManager {
  constructor() {
    this.products = [];
  }

  // Agregar un nuevo producto
  addProduct(title, description, price, thumbnail, id, stock) {
    if (!title || !description || !price || !thumbnail || !stock || !id) {
      throw new Error("Todos los campos del producto son obligatorios.");
    }
    const product = {
      title,
      description,
      price,
      thumbnail,
      id,
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

// Dejo el generateRandomId aca porque no estoy usando inputs sino basicamente hardcodeando los productos en esta entrega,
// asi que lo uso simplemente para crear 2 productos que usen el generador y otros 2 que no, de forma que se pueda testear el poder eliminar o etc
let usedIds = new Set();

function generateRandomId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const idLength = 6;
  let id = "";
  while (id.length < idLength) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  // No me voy a poner a hacer un control in-depth, lo agrego asi nomas para solucionar cualquier error temporalmente
  if (usedIds.has(id)) {
    id += characters.charAt(randomIndex);
  }
  usedIds.add(id);
  return id;
}

module.exports = { ProductManager, generateRandomId };
