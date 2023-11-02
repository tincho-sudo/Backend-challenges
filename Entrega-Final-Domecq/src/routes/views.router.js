const express = require("express");
const router = express.Router();
const Message = require("../dao/mongo/models/message.model.js");
const Cart = require("../dao/mongo/models/cart.model.js");
const axios = require("axios");
const { PORT } = require("../config/env.js");
const { isValidPassword } = require("../utils.js");
const {
  getUsers,
  getUserByEmail,
} = require("../controllers/users.controller.js");
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");

  next();
};
const privateAccess = (req, res, next) => {
  if (!req.session.user) return res.status(403).redirect("/login");
  next();
};

const auth = (req, res, next) => {
  if (req.session.user.role !== "admin") return res.redirect("/");
  next();
};

router.get("/", privateAccess, async (req, res) => {
  try {
    //const manager = req.manager;
    const username = req.session?.user.first_name;

    req.session.user = {
      first_name: req.session.user.first_name.includes(" ")
        ? req.session.user.first_name.split(" ")[0]
        : req.session.user.first_name,
      last_name:
        req.session.user.first_name !== undefined &&
        req.session.user.first_name.includes(" ")
          ? req.session.user.first_name.split(" ")[1]
          : req.session.user.last_name,
      email: req.session.user.email,
      age: req.session.user.age,
      role: req.session.user.role,
    };
    res.render("home", { title: "Home", username: username });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({ success: false, error: "Error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const username =
      req.session?.user.first_name + " " + req.session?.user.last_name;
    const userCart = await getUserByEmail(req.session?.user.email);
    const cartId = req.query.cid ? req.query.cid : userCart.cart;
    let productsResponse = await axios.get(
      `http://127.0.0.1:${PORT}/api/products?limit=${limit}&page=${page}`
    );
    productsResponse.data.products.payload =
      productsResponse.data.products.payload.map((product) => ({
        ...product,
        cartId: cartId,
      }));
    const totalPages = productsResponse.data.products.totalPages;
    const currentPage = productsResponse.data.products.page;

    let hasNextPage;
    let hasPreviousPage;
    let prevLink;
    let nextLink;
    hasNextPage = productsResponse.data.products.hasNextPage;
    hasPreviousPage = productsResponse.data.products.hasPrevPage;

    if (hasNextPage) {
      prevLink = hasPreviousPage
        ? `/products?limit=${limit}&page=${currentPage - 1}&cid=${cartId}`
        : null;
      nextLink = hasNextPage
        ? `/products?limit=${limit}&page=${currentPage + 1}&cid=${cartId}`
        : null;
    }
    res.render("products", {
      products: productsResponse.data.products.payload,
      totalPages: totalPages,
      currentPage: currentPage,
      hasNextPage: hasNextPage,
      hasPreviousPage: hasPreviousPage,
      cartId,
      prevLink,
      nextLink,
      title: "Products",
      username: username,
    });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    //const manager = req.manager;
    console.log(productId);
    const product = await axios.get(
      `http://127.0.0.1:${PORT}/api/products/${productId}`
    );
    //const product = await manager.getProductById(productId);
    //const cartId = req.query.cid ? req.query.cid : undefined;
    console.log(product.data.product);
    res.render("productDetails", {
      product: product.data.product,
      title: "Product Details",
      cartId: req.session.user.cart,
    });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el producto" });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    //const cartManager = req.cartManager;
    const cart = await Cart.findById(cartId).populate("products", "product");

    res.render("cartDetails", {
      cartId: cart._id.toString(),
      products: cart.products.map((products) => products.toJSON()),
      title: "Cart Details",
    });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el carrito" });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const { mid, uid } = req.query;
    let messages;

    if (mid) {
      messages = await Message.find({ _id: mid.toString() }).limit(limit);
    } else if (uid) {
      messages = await Message.find({ user: uid.toString() }).limit(limit);
    } else {
      messages = await Message.find().limit(limit);
    }

    // Convertir _id a cadenas en el array de mensajes
    const formattedMessages = messages.map((message) => ({
      ...message._doc,
      _id: message._id.toString(),
    }));

    res.render("messages", { messages: formattedMessages, title: "Messages" });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los mensajes" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const manager = req.manager;
    const products = await manager.getAllProducts();
    res.render("realTimeProducts", { products, title: "RealTimeProducts" });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
});

router.get("/login", publicAccess, (req, res) => {
  if (req.session.user !== undefined)
    res.render("login", { loginStatus: true, title: "Login" });
  else res.render("login", { loginStatus: false, title: "Login" });
});

router.get("/backoffice", privateAccess, auth, async (req, res) => {
  try {
    const users = await getUsers();

    res.render("backOffice", {
      loginStatus: true,
      title: "Backoffice",
      role: req.session.user.role,
      users: users,
    });
  } catch (error) {
    res.status(500).send("Error al obtener la lista de usuarios.");
  }
});

router.get("/profile", privateAccess, (req, res) => {
  if (req.session.user !== undefined)
    try {
      res.render("profile", {
        login_status: true,
        email: req.session.user.email,
        age: req.session.user.age,
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        title: "Perfil",
        role: req.session.user.role,
      });
    } catch (error) {
      req.logger.error(error);
      res
        .status(500)
        .json({ success: false, error: "Error al obtener el usuario" });
    }
  else {
    res.render("profile", {
      login_status: false,
    });
  }
});

router.get("/register", publicAccess, async (req, res) => {
  if (req.session.user === undefined)
    try {
      res.render("register", {
        loginStatus: req.session.email,
      });
    } catch (error) {
      req.logger.error(error);
      res.status(500);
    }
  else {
    res.status(500).json({
      success: false,
      error: "Primero tenes que cerrar la sesion actual",
    });
  }
});
router.get("/cart", privateAccess, async (req, res) => {
  try {
    const user = await getUserByEmail(req.session.user.email);
    const cartId = user.cart.toString();
    if (req.session.user !== undefined) {
      const cartData = await axios.get(
        `http://127.0.0.1:${PORT}/api/carts/${cartId}`
      );
      res.render("cart", {
        cartId: cartId,
        cartContent: cartData.data.cart.products,
        loginStatus: true,
        title: "Cart",
        username: user.first_name,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/resetpassword", async (req, res) => {
  res.render("resetPassword", { title: "Reset Password" });
});

module.exports = router;
