const { UsersDaoFactory } = require("../dao/factory.js");
const usersService = UsersDaoFactory.getDao();
const UserDTO = require("../dao/dto/user.dto");
const { createHash, uploader } = require("../utils");
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
      return res.status(200).json({
        success: "Login success",
        payload: req.session.user,
        user: req.session.user,
      });
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
  const user = new UserDTO(req.session.user);
  if (req.session.user) res.status(200).send({ status: "ok", user: user });
  else {
    res.status(500).send({ status: "error", user: user });
  }
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
  try {
    const { email, password } = req.body;
    const newPassword = req.query.newPassword;

    if (!newPassword) {
      return res.status(400).json({
        status: "error",
        error: "La nueva contraseña no fue proporcionada.",
      });
    }

    if (newPassword === req.user.password) {
      return res.status(400).json({
        status: "error",
        error: "No puedes utilizar la misma contraseña.",
      });
    }

    const timestamp = req.query.timestamp;
    const now = Date.now();
    const maxTime = 3600000;

    if (now - timestamp > maxTime)
      return res
        .status(400)
        .json({ status: "error", error: "Token expirado" })
        .redirect(`http://localhost:${PORT}/mail?expired=true`);

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        error: "Datos de validación incorrectos.",
      });
    }

    const user = await usersService.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        status: "error",
        error: "Usuario no encontrado.",
      });
    }

    const newHashedPassword = createHash(password);

    await usersService.resetPassword(user._id, newHashedPassword);

    res.status(200).json({
      status: "success",
      message: "Contraseña actualizada exitosamente.",
    });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({
      status: "error",
      error: "Error al restablecer la contraseña.",
    });
  }
};

const setPremium = async (req, res) => {
  const userId = req.params.uid;

  try {
    const user = await usersService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.role === "user") {
      const requiredDocuments = ["id", "address", "accountStatus"];
      const userDocuments = user.documents || [];

      const docsCheck = requiredDocuments.every((requiredDocument) => {
        return userDocuments.some((userDocument) =>
          userDocument.name.includes(requiredDocument)
        );
      });

      if (!docsCheck) {
        throw new Error("User must have all documents!");
      }
    }
    const updatedUser = await usersService.setPremium(user);

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res
      .status(500)
      .json({ success: false, error: "Error updating user role" });
  }
};

const setLastConnection = async (req, res) => {
  const userId = req.params.uid;

  try {
    const user = await usersService.getUserById(userId);
    const updatedUser = await usersService.setLastConnection(user);
    return res
      .status(200)
      .json({ success: true, user: updatedUser.last_connection });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res
      .status(500)
      .json({ success: false, error: "Error updating user role" });
  }
};

const updateUserDocuments = async (id, files) => {
  try {
    const user = await usersService.getUserById(id);
    const documents = user.documents || [];
    const newDocuments = [
      ...documents,
      ...files.map((file) => ({
        name: file.originalname,
        reference: file.path,
      })),
    ];

    return await usersService.updateUserDocuments(user, newDocuments);
  } catch (error) {
    throw error;
  }
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
  setPremium,
  setLastConnection,
  updateUserDocuments,
};
