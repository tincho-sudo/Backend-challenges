const productsRouter = require("../routes/products.router");
const cartsRouter = require("../routes/carts.router");
const messagesRouter = require("../routes/messages.router");
const usersRouter = require("../routes/users.router");
const ticketsRouter = require("../routes/tickets.router");
const mocksRouter = require("../routes/mocks.router");
const logsRouter = require("../routes/logs.router");
const viewsRouter = require("../routes/views.router");
const { sendEmail } = require("../controllers/mailing.controller");
const { PORT } = require("./env");
const express = require("express");

module.exports = {
  configureRoutes: (app) => {
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/api/messages", messagesRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/tickets", ticketsRouter);
    app.use("/api/mockingproducts", mocksRouter);
    app.use("/api/loggerTest", logsRouter);
    app.get("/mail", async (req, res) => {
      const recipientEmail = req.user.email;
      const timestamp = Date.now();
      const resetPasswordLink = `http://localhost:${PORT}/resetpassword?timestamp=${timestamp}`;
      const subject = "Reestablecer Contraseña";
      const htmlContent = `<div><h1>Hola ${req.user.first_name}, a continuacion vas a encontrar el enlace para reestablecer la contraseña.</h1> <a href=${resetPasswordLink} target="_blank" >Reestablecer Contraseña</a> </div>`;
      const emailResult = await sendEmail(recipientEmail, subject, htmlContent);
      if (emailResult.status === "success") {
        res.status(200).send(emailResult);
      } else {
        res.status(500).send(emailResult);
      }
    });
    app.use("/", viewsRouter);
    app.use(
      "/static",
      express.static(__dirname.substring(0, __dirname.length - 6) + "/public")
    );
  },
};
