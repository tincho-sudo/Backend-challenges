const express = require("express");
const router = express.Router();
const User = require("../dao/models/user.model");

router.post("/logout", (req, res) => {
  if (req.session.user !== undefined) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(440).json({ error: err });
      } else {
        return res.status(200).json({ success: "Logout success" });
      }
    });
  } else {
    return res.status(500).json({ error: "No hay una sesión iniciada" });
  }
});

router.post("/login", async (req, res) => {
  if (req.session.user === undefined) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email, password });
      let priv;
      if (email === "adminCoder@coder.com" && password === "adminCod3r123")
        priv = "admin";
      // no termino de entender por que no puedo dejar la validacion de privilegios por db, pero bueno..
      //else priv = user.priv;
      else priv = "user";

      if (user) {
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
          priv: priv,
        };
        return res
          .status(200)
          .json({ success: "Login success", payload: req.session.user });
      }
      return res.status(401).json({ error: "Login ERROR" });
    } catch (error) {
      console.error("Error al realizar la consulta:", error);
      return res.status(500).json({ error: "Error de servidor" });
    }
  } else {
    return res.status(500).json({ error: "Ya hay una sesión iniciada" });
  }
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (req.session.user === undefined) {
    try {
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({ error: "El email ya está en uso." });
      }
      const user = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        password: password,
        //priv: "usuario", ....
      };
      await User.create(user);
      return res.status(201).json({
        success: true,
        message: "Nuevo usuario añadido.",
        user: user,
      });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return res.status(500).json({ error: "Error de servidor" });
    }
  } else {
    return res.status(500).json({ error: "Ya hay una sesión iniciada" });
  }
});

router.get("/backoffice", auth, (req, res) => {
  if (req.session.user.priv === "admin")
    res.json({ success: "Se confirmo el nivel de privilegios" });
});

function auth(req, res, next) {
  if (req.session.user !== undefined && req.session.user.priv === "admin") {
    return next();
  }
  return res.status(401).json({ error: "Auth error" });
}

module.exports = { router };
