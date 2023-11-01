const express = require("express");
const displayRoutes = require("express-routemap");
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
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const { router: usersRouter } = require("./routes/users.router");
const { router: viewsRouter } = require("./routes/views.router");
const { router: mocksRouter } = require("./routes/mocks.router");
const { router: messagesRouter } = require("./routes/messages.router");
const { router: ticketsRouter } = require("./routes/tickets.router");
const { router: logsRouter } = require("./routes/logs.router");
const { MongoSingleton } = require("./db/mongo-connection");
const {
  PORT,
  SESSION_SECRET,
  GMAILCODERUSER,
  GMAILCODERPASS,
} = require("./config/env");
const mongoInstance = MongoSingleton.getInstance();
const dbURI = MongoSingleton.getURI();
const activeConnections = new Set();
const compression = require("express-compression");
const { addLogger } = require("./config/logger");
const nodemailer = require("nodemailer");
const swaggerUiExpress = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion API Coder",
      description: "Documentacion Swagger",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(addLogger);
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
    cookie: {
      maxAge: 3600000, // 1 hora
    },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/users", usersRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/mockingproducts", mocksRouter);
app.use("/api/loggerTest", logsRouter);
app.get("/mail", async (req, res) => {
  const timestamp = Date.now();
  const resetPasswordLink = `http://localhost:${PORT}/resetpassword?timestamp=${timestamp}`;

  let result = await transport.sendMail({
    from: `TestCoder <${GMAILCODERUSER}>`,
    to: `${req.user.email}`,
    subject: "Test",
    html: `<div><h1>Hola ${req.user.first_name}, a continuacion vas a encontrar el enlace para reestablecer la contraseña.</h1> <a href=${resetPasswordLink} target="_blank" >Reestablecer Contraseña</a> </div>`,
    attachments: [],
  });
  res.send({ status: "sucess", result: result, ok: "Email Sent" });
});
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
app.use(compression);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.get("*", (_, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

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

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: `${GMAILCODERUSER}`,
    pass: `${GMAILCODERPASS}`,
  },
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

module.exports = { io, transport };
