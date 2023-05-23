const express = require("express");
const { ProductManager } = require("./ProductManager");

const app = express();
const port = 3000;

const manager = new ProductManager();

// Ruta para obtener todos los productos
app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await manager.getAllProducts(limit);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Ruta para obtener un producto por su ID
app.get("/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await manager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

app.get("*", (_, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
