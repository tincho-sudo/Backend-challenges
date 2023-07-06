const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const hbs = require("express-handlebars");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { ProductManager } = require("./dao/ProductManager");
const { CartManager } = require("./dao/CartManager");
const manager = new ProductManager(io);
const cartManager = new CartManager(io);
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const { router: viewsRouter } = require("./routes/views.router");
const messagesRouter = require("./routes/messages.router");
const { DB_USER, DB_PASSWORD, DB_CLUSTER, PORT } = require("./config/env");
const mongoose = require("mongoose");
const dbURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}`;
// Almaceno los clientes activos, no va a tener mucho uso por el momento, pero bueno..
const activeConnections = new Set();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, __, next) => {
  req.manager = manager;
  req.cartManager = cartManager;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/", viewsRouter);
app.use("/static", express.static(__dirname + "/public"));
app.engine("hbs", hbs.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.get("*", (_, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Agrega la conexión activa a la lista
  activeConnections.add(socket);

  // Escucha el evento de creación de un nuevo producto
  socket.on("productCreated", () => {
    //console.log("Aaaaa");
    io.emit("productCreated");
  });

  // Escucha el evento de eliminación de un producto
  socket.on("productDeleted", () => {
    io.emit("productDeleted");
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    // Elimina la conexión de la lista
    activeConnections.delete(socket);
  });
});

async function startServer() {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión a MongoDB Atlas exitosa");
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
  }
}

startServer();

module.exports = { io };
