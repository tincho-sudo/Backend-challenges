const { UsersDaoFactory } = require("../dao/factory.js");
const usersService = UsersDaoFactory.getDao();

const { createHash } = require("../utils");
const logout = (req, res) => {
  if (req.session.user !== undefined) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(440).json({ error: err });
      } else {
        return res.status(200).json({ success: "Logout success" });
      }
    });
    res.clearCookie("connect.sid");
  } else {
    return res.status(500).json({ error: "No hay una sesión iniciada" });
  }
};

const login = async (req, res) => {
  if (req.session.user === undefined) {
    const user = req.user;

    if (user) {
      req.session.user = user;

      console.log(
        "Devuelvo la session con passport por requisito: ",
        req.session
      );
      return res
        .status(200)
        .json({ success: "Login success", payload: req.session.user });
    }

    return res.status(401).json({ error: "Login ERROR" });
  } else {
    return res.status(500).json({ error: "Ya hay una sesión iniciada" });
  }
};

const failLogin = async (_, res) => {
  res.status(400).send({ status: "error", error: "login error" });
};

const failRegister = async (_, res) => {
  res.status(400).send({ status: "error", error: "Error registering user" });
};

const currentUser = async (req, res) => {
  res.status(200).send({ status: "ok", payload: req.session });
};

const newUser = async (_, res) => {
  return res
    .status(200)
    .json({ ok: "ok", payload: "Usuario creado satisfactoriamente" });
};
const backOffice = (req, res) => {
  if (req.session.user.priv === "admin")
    res.json({ success: "Se confirmo el nivel de privilegios" });
};
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      error: "data validation error",
    });
  }

  const user = await usersService.getUserByEmail(email);

  if (!user)
    return res.status(400).send({ status: "error", error: "User not found" });

  const newHashedPassword = createHash(password);

  await usersService.resetPassword(user._id, newHashedPassword);
  res
    .status(200)
    .send({ status: "success", message: "Contraseña actualizada" });
};

const auth = (req, res, next) => {
  if (req.session.user !== undefined && req.session.user.priv === "admin") {
    return next();
  }
  return res.status(401).json({ error: "Auth error" });
};

module.exports = {
  auth,
  login,
  logout,
  resetPassword,
  failLogin,
  failRegister,
  backOffice,
  newUser,
  currentUser,
  usersService,
};
