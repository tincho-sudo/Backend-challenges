const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  auth,
  logout,
  login,
  failLogin,
  currentUser,
  newUser,
  failRegister,
  backOffice,
  resetPassword,
  setPremium,
} = require("../controllers/users.controller");

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

router.post("/logout", logout);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/users/faillogin" }),
  login
);

router.post("/faillogin", failLogin);

router.get(
  "/current",
  currentUser,
  passport.authenticate("current", { session: false })
);

router.post(
  "/register",
  (req, res, next) => {
    if (req.session.user !== undefined) {
      return res.status(500).json({ error: "Ya hay una sesión iniciada" });
    }
    next();
  },
  passport.authenticate("register", {
    failureRedirect: "/api/users/failregister",
  }),
  (req, res, next) => {
    res.status(201).json({ message: "Registro exitoso", user: req.user });
    next();
  }
);

router.post("/premium/:uid", auth, setPremium);

router.get("/failregister", failRegister);

router.get("/backoffice", auth, backOffice);

router.put("/resetpassword", resetPassword);

module.exports = { router };
