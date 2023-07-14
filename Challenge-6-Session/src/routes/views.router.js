const express = require("express");
const router = express.Router();
const Message = require("../dao/models/message.model.js");
const Product = require("../dao/models/product.model.js");
const Cart = require("../dao/models/cart.model.js");
const axios = require("axios");
const { PORT } = require("../config/env.js");
router.get("/", async (req, res) => {
  try {
    const manager = req.manager;
    const username = req.session?.user;
    const products = await manager.getAllProducts();
    res.render("home", { products, title: "Home", username: username });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los mensajes" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const cartId = req.query.cid ? req.query.cid : undefined;
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
    console.log(productsResponse.data.products);
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
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const manager = req.manager;
    const product = await manager.getProductById(productId);
    const cartId = req.query.cid ? req.query.cid : undefined;
    console.log(cartId);
    res.render("productDetails", { product, cartId, title: "Product Details" });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
});

router.get("/login", (req, res) => {
  res.render("login", { loginStatus: req.session.email, title: "Login" });
});

router.get("/profile", async (req, res) => {
  try {
    res.render("profile", {
      loginStatus: req.session.email,
      email: req.session.email,
      age: req.session.age,
      firstName: req.session.first_name,
      lastName: req.session.last_name,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el usuario" });
  }
});

router.get("/register", async (req, res) => {
  try {
    res.render("register", {
      loginStatus: req.session.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = { router };
