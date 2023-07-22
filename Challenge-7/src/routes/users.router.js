const express = require("express");
const router = express.Router();
const User = require("../dao/models/user.model");
const passport = require("passport");
const { createHash, isValidPassword } = require("../utils");

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/api/users/login" }),
  async (req, res) => {
    req.session.user = req.user;
    // console.log("req.session.user: ", req.session.user);
    res.redirect("/");
  }
);

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

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/users/faillogin" }),
  async (req, res) => {
    if (req.session.user === undefined) {
      const { email } = req.body;
      try {
        const user = await User.findOne({ email });
        if (user) {
          req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
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
  }
);

router.post("/faillogin", async (_, res) => {
  res.status(400).send({ status: "error", error: "login error" });
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/users/failregister",
  }),
  async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (req.session.user === undefined) {
      try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser !== null) {
          const user = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            age: age,
            password: createHash(password),
            //priv: "usuario", ....
          };
          await User.create(user);
          return res.status(201).json({
            success: true,
            message: "Nuevo usuario añadido.",
            user: user,
          });
        }
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        return res.status(500).json({ error: "Error de servidor" });
      }
    } else {
      return res.status(500).json({ error: "Ya hay una sesión iniciada" });
    }
  }
);

router.get("/failregister", async (_, res) => {
  res.status(400).send({ status: "error", error: "Error registering user" });
});

router.get("/backoffice", auth, (req, res) => {
  if (req.session.user.priv === "admin")
    res.json({ success: "Se confirmo el nivel de privilegios" });
});

router.put("/resetpassword", async (req, res) => {
  const { email, password } = req.body;
  console.log(email + " " + password);
  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      error: "data validation error",
    });
  }

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).send({ status: "error", error: "User not found" });

  const newHashedPassword = createHash(password);

  await User.updateOne(
    { _id: user._id },
    { $set: { password: newHashedPassword } }
  );
  res
    .status(200)
    .send({ status: "success", message: "Contraseña actualizada" });
});
function auth(req, res, next) {
  if (req.session.user !== undefined && req.session.user.priv === "admin") {
    return next();
  }
  return res.status(401).json({ error: "Auth error" });
}

module.exports = { router };
