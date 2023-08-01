const express = require("express");
const router = express.Router();
const User = require("../dao/models/user.model");
const passport = require("passport");
const { createHash } = require("../utils");

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
    res.clearCookie("connect.sid");
  } else {
    return res.status(500).json({ error: "No hay una sesión iniciada" });
  }
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/users/faillogin" }),
  async (req, res) => {
    if (req.session.user === undefined) {
      const user = req.user;

      if (user) {
        req.session.user = user;

        console.log("Devuelvo la session con passport por requisito: ", req.session);
        return res
          .status(200)
          .json({ success: "Login success", payload: req.session.user });
      }

      return res.status(401).json({ error: "Login ERROR" });
    } else {
      return res.status(500).json({ error: "Ya hay una sesión iniciada" });
    }
  }
);

router.post("/faillogin", async (_, res) => {
  res.status(400).send({ status: "error", error: "login error" });
});

router.get("/current",passport.authenticate("current", {session: false}), async (req, res) => {
  res.status(200).send({ status: "ok", payload: req.session });
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/users/failregister",
  }),
  async (req, res) => {
    return res
      .status(200)
      .json({ ok: "ok", payload: "Usuario creado satisfactoriamente" });
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
