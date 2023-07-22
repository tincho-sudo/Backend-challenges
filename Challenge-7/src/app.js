const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { initializePassport } = require("./config/passport.config");
const passport = require("passport");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { ProductManager } = require("./dao/ProductManager");
const { CartManager } = require("./dao/CartManager");
const manager = new ProductManager(io);
const cartManager = new CartManager(io);
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const { router: usersRouter } = require("./routes/users.router");
const { router: viewsRouter } = require("./routes/views.router");
const messagesRouter = require("./routes/messages.router");
const {
  DB_USER,
  DB_PASSWORD,
  DB_CLUSTER,
  PORT,
  SESSION_SECRET,
} = require("./config/env");
const mongoose = require("mongoose");
const dbURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}`;

const activeConnections = new Set();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(SESSION_SECRET));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbURI,
      ttl: 3600,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
  })
);

app.use((req, __, next) => {
  req.manager = manager;
  req.cartManager = cartManager;
  next();
});

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);
app.use("/static", express.static(__dirname + "/public"));
app.engine(
  "hbs",
  hbs.create({
    helpers: {
      isEqual: function (value1, value2, options) {
        return value1 === value2 ? options.fn(this) : options.inverse(this);
      },
    },
  }).engine
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.get("*", (_, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  activeConnections.add(socket);

  socket.on("productCreated", () => {
    io.emit("productCreated");
  });

  socket.on("productDeleted", () => {
    io.emit("productDeleted");
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    activeConnections.delete(socket);
  });
});

async function startServer() {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
