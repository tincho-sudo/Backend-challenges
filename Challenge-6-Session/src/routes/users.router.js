const express = require("express");
const router = express.Router();
const User = require("../dao/models/user.model");

router.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(440).json({ error: "Logout ERROR" });
      } else {
        return res.status(200).json({ success: "Logout success" });
      }
    });
  } else {
    return res.status(500).json({ error: "No hay una sesión iniciada" });
  }
});

router.post("/login", async (req, res) => {
  if (!req.session.user) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
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
  if (!req.session.user) {
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ error: "El email ya está en uso." });
      }
      const user = {
        first_name,
        last_name,
        email,
        age,
        password,
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

function auth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Auth error" });
}

module.exports = { router, auth };
