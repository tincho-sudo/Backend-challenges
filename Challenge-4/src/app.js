const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const hbs = require("express-handlebars");
const app = express();
const port = 8080;
const server = http.createServer(app);
const io = socketIO(server);
const { ProductManager } = require("./ProductManager");
const manager = new ProductManager(io);
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
// Almaceno los clientes activos, no va a tener mucho uso por el momento, pero bueno..
const activeConnections = new Set();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, __, next) => {
  req.manager = manager;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
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
    console.log("Aaaaa");
    
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

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = { io };
