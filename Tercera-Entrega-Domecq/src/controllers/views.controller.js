const { PORT } = require("../config/env.js");
const { isValidPassword } = require("../utils.js");
const { messagesService } = require("../controllers/messages.controller");
const { cartsService } = require("../controllers/carts.controller");
const axios = require("axios");
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

const homeView = async (req, res) => {
  try {
    //const manager = req.manager;
    const username = req.session?.user.first_name;
    let role;
    //const products = await manager.getAllProducts();
    if (
      req.session.user.email === "adminCoder@coder.com" &&
      isValidPassword(req.session.user, "adminCod3r123")
    )
      role = "admin";
    else role = "user";
    console.log(req.session.user);
    req.session.user = {
      first_name: req.session.user.first_name.includes(" ")
        ? req.session.user.first_name.split(" ")[0]
        : req.session.user.first.name,
      last_name:
        req.session.user.first_name !== undefined &&
        req.session.user.first_name.includes(" ")
          ? req.session.user.first_name.split(" ")[1]
          : req.session.user.last_name,
      email: req.session.user.email,
      age: req.session.user.age,
      role: role,
    };
    res.render("home", { title: "Home", username: username });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Error" });
  }
};

const productsView = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const username =
      req.session?.user.first_name + " " + req.session?.user.last_name;
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
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
};

const productsViewById = async (req, res) => {
  try {
    const productId = req.params.id;
    const manager = req.manager;
    const product = await manager.getProductById(productId);
    const cartId = req.query.cid ? req.query.cid : undefined;
    //  console.log(cartId);
    res.render("productDetails", { product, cartId, title: "Product Details" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el producto" });
  }
};

const cartDetails = async (req, res) => {
  try {
    const cartId = req.params.cid;
    //const cartManager = req.cartManager;
    const cart = await cartsService.getCartById(cartId);

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
};

const messagesView = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const { mid, uid } = req.query;
    let query = {};
    if (mid) {
      query._id = mid.toString();
    } else if (uid) {
      query.user = uid.toString();
    }

    const messages = await messagesService.findMessages(query).limit(limit);

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
};

const realTimeView = async (req, res) => {
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
};

const loginView = (req, res) => {
  if (req.session.user !== undefined)
    res.render("login", { loginStatus: true, title: "Login" });
  else res.render("login", { loginStatus: false, title: "Login" });
};

const backOfficeView = (req, res) => {
  res.render("backOffice", {
    loginStatus: true,
    title: "Backoffice",
    role: req.session.user.role,
  });
};

const profileView = (req, res) => {
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
      console.log(error);
      res
        .status(500)
        .json({ success: false, error: "Error al obtener el usuario" });
    }
  else {
    res.render("profile", {
      login_status: false,
    });
  }
};

const registerView = async (req, res) => {
  if (req.session.user === undefined)
    try {
      res.render("register", {
        loginStatus: req.session.email,
      });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  else {
    res.status(500).json({
      success: false,
      error: "Primero tenes que cerrar la sesion actual",
    });
  }
};

const resetPasswordView = async (_, res) => {
  res.render("resetPassword", { title: "Reset Password" });
};
module.exports = {
  publicAccess,
  privateAccess,
  auth,
  homeView,
  productsView,
  productsViewById,
  cartDetails,
  messagesView,
  realTimeView,
  loginView,
  backOfficeView,
  profileView,
  registerView,
  resetPasswordView,
};
