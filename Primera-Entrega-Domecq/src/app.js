const express = require("express");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const app = express();
const port = 8080;

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("*", (_, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
