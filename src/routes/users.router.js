const express = require("express");
const router = express.Router();
const passport = require("passport");
const { uploader } = require("../utils");

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
  usersService,
  setLastConnection,
  updateUserDocuments,
  getUsers,
  removeInactives,
  getUserByEmail,
} = require("../controllers/users.controller");

const setUserLastConnection = async (req, res, next) => {
  let userId;
  if (req.user) userId = req.user._id.toString();
  setLastConnection(userId);
  next();
};

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

router.post("/logout", setUserLastConnection, logout);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/users/faillogin" }),
  setUserLastConnection,
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

router.post("/premium/:uid", setPremium);

router.get("/failregister", failRegister);

router.get("/backoffice", auth, backOffice);

router.put("/resetpassword", resetPassword);

router.post(
  "/:uid/documents",
  uploader("documents").array("documents"),
  async (req, res) => {
    const userId = req.params.id;
    const user = updateUserDocuments(userId, req.files);
    res.send({ message: "User documents updated!", user });
  }
);

router.get("/:email", auth, async (req, res) => {
  const userEmail = req.params.email;
  const user = await getUserByEmail(userEmail);
  res.send({ status: "success", user: user });
});

router.get("/", async (_, res) => {
  const users = await getUsers();
  res.send({ message: "Users", users: users });
});

router.delete("/", async (_, res) => {
  const users = await removeInactives();
  res.send({ message: "Users", usersDeleted: users });
});

module.exports = { router };
