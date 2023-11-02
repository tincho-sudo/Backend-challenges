const express = require("express");
const displayRoutes = require("express-routemap");
const socketIO = require("socket.io");
const http = require("http");
const { initializePassport } = require("./config/passport.config");
const passport = require("passport");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { MongoSingleton } = require("./db/mongo-connection");
const { PORT } = require("./config/env");
const mongoInstance = MongoSingleton.getInstance();
const activeConnections = new Set();
const compression = require("express-compression");

// logger
const { addLogger } = require("./config/logger");
app.use(addLogger);

// swagger
const swaggerConfig = require("./config/swagger.config.js");
swaggerConfig.setupSwagger(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session
const sessionConfig = require("./config/session.config");
sessionConfig.configureSession(app);

// passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// routes
const routesConfig = require("./config/routes.config.js");
routesConfig.configureRoutes(app);

// handlebars
const handlebarsConfig = require("./config/handlebars.config");
handlebarsConfig.configureHandlebars(app);
app.use(compression);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.get("*", (_, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// io.. realmente inutil
io.on("connection", (socket) => {
  activeConnections.add(socket);

  socket.on("productCreated", () => {
    io.emit("productCreated");
  });

  socket.on("productDeleted", () => {
    io.emit("productDeleted");
  });

  socket.on("disconnect", () => {
    activeConnections.delete(socket);
  });
});

async function startServer() {
  try {
    await mongoInstance;
    console.log("Conexión a MongoDB Atlas exitosa");
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
      displayRoutes(app);
    });
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
  }
}

startServer();

module.exports = { io };
