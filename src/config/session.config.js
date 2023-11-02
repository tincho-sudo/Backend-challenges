const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const { SESSION_SECRET } = require("./env");
const { MongoSingleton } = require("../db/mongo-connection");

const mongoInstance = MongoSingleton.getInstance();
const dbURI = MongoSingleton.getURI();

const configureSession = (app) => {
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
};

module.exports = {
  configureSession,
};
