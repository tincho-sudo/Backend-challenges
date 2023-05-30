const fs = require("fs");

class CartManager {
  constructor() {
    this.carts = [];
    this.counter = 1;
    this.directoryPath = "../Primera-Entrega-Domecq/data";
    this.path = this.directoryPath + "/cart-data.json";

    if (!fs.existsSync(this.directoryPath)) {
      fs.mkdirSync(this.directoryPath);
    }

    this.getCartsFromFile();
  }

  async createCart() {
    try {
      const id = this.counter++;
      const cart = {
        id,
        products: [],
      };
      this.carts.push(cart);
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
      return this.carts.find((cart) => cart.id === id);
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw error;
    }
  }

  async updateCart(cart) {
    try {
      await this.getCartsFromFile();
      const cartIndex = this.carts.findIndex((c) => c.id === cart.id);
      if (cartIndex === -1) {
        throw new Error(`No se encontró ningún carrito con el ID: ${cart.id}`);
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
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    } catch (error) {
      console.error("Error al escribir en el archivo de carritos:", error);
      throw error;
    }
  }

  async getCartsFromFile() {
    try {
      const cartsFile = await fs.promises.readFile(this.path, "utf-8");

      if (cartsFile.length === 0) {
        // El archivo está vacío, inicializar con valores predeterminados
        this.carts = [];
        this.counter = 1;
        return;
      }

      const cartsData = JSON.parse(cartsFile);

      // Obtener el último valor de counter
      const lastCart = cartsData[cartsData.length - 1];
      this.counter = lastCart.id + 1;
      this.carts = cartsData;
      console.log(cartsData);
    } catch (error) {
      console.error("Error al cargar los carritos desde el archivo:", error);
      throw error;
    }
  }
}

module.exports = { CartManager };
