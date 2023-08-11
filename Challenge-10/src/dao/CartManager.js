const fs = require("fs");
const Cart = require("../dao/models/cart.model");

class CartManager {
  constructor() {
    this.carts = [];
    this.counter = 1;
    this.directoryPath = "../Challenge-10/data";
    this.path = this.directoryPath + "/cart-data.json";

    if (!fs.existsSync(this.directoryPath)) {
      fs.mkdirSync(this.directoryPath);
    }
  }

  async createCart(cartId) {
    try {
      const cart = {
        cartId,
        products: [],
      };
      this.carts.push(cart);
      //console.log(cart);
      await this.setCartsFile();
      return cart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }
  async getCartById(id) {
    try {
      await this.getCartsFromFile();
      return this.carts.find((cart) => cart._id === id);
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw error;
    }
  }

  async getCartByIdDb(id) {
    try {
      return await Cart.findById(id);
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw error;
    }
  }

  async updateCart(cart) {
    try {
      await this.getCartsFromFile();
      const cartIndex = this.carts.findIndex((c) => c._id === cart._id);
      if (cartIndex === -1) {
        throw new Error(`No se encontró ningún carrito con el ID: ${cart._id}`);
      } else {
        this.carts[cartIndex] = cart;
        await this.setCartsFile();
      }
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error;
    }
  }

  async setCartsFile() {
    try {
      const carts = await Cart.find(); // Obtener todos los productos de la base de datos

      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      this.carts = carts;
    } catch (error) {
      console.error("Error al escribir en el archivo de carritos:", error);
      throw error;
    }
  }

  async getCartsFromFile() {
    try {
      const cartsFile = await fs.promises.readFile(this.path, "utf-8");
      this.carts = JSON.parse(cartsFile);
      return this.carts;
    } catch (error) {
      console.error("Error al cargar los carritos desde el archivo:", error);
      console.error("Error al leer el archivo de carritos:", error);
      console.error("Recuperando desde la base de datos...");
      const carts = await Carts.find(); // Obtener todos los productos de la base de datos
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      this.carts = carts;
      return this.carts;
    }
  }
}

module.exports = { CartManager };
