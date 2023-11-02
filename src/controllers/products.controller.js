const Product = require("../dao/mongo/models/product.model");

const { ProductsDaoFactory } = require("../dao/factory.js");
const { sendEmail } = require("./mailing.controller.js");
const productsService = ProductsDaoFactory.getDao();

// La funcion getAllProducts va a permanecer utilizando el dao sin el service por ser sencillamente inconveniente
// llevo tiempo razonar el paginado como para meterme en este quilombo de refactoring sin tenerlo previsto
// si transformo a productsquery en un array que contenga los productos (que es lo que conseguiria usando productsService)
// entonces pierdo el uso de todas las funciones de filtro de mongoose, y es totalmente inconveniente volver a generarlas en el service
// asi que decidi que no tiene sentido e hice rollback a esta funcion al estado de uso directo del dao
const getAllProducts = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const categ = req.query.categ ? req.query.categ.toString() : "*";
    const sort = req.query.sort ? req.query.sort.toString() : "";
    const cartId = req.query.cid ? req.query.cid.toString() : undefined;
    const available = req.query.available ? req.query.available.toString() : "";

    // inicializo query
    let productsQuery;

    // filtro categ
    if (categ !== "*") {
      productsQuery = Product.find({ categ: categ }).collation({
        locale: "en",
        strength: 1,
      });
    } else {
      productsQuery = Product.find();
    }

    // filtro por stock
    if (available === "true") {
      productsQuery = productsQuery.where("stock").gte(1); // stock >=1
    } else if (available === "false") {
      productsQuery = productsQuery.where("stock").equals(0); // stock=0
    }

    // limit
    if (limit) {
      productsQuery = productsQuery.limit(limit);
    }

    // paginacion
    if (page) {
      const skip = (page - 1) * limit;
      productsQuery = productsQuery.skip(skip);
    }

    // sort
    if (sort === "asc") {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === "desc") {
      productsQuery = productsQuery.sort({ price: -1 });
    }

    const products = await productsQuery.exec();
    // saca el total de productos

    const totalProducts = await Product.countDocuments(
      productsQuery.getFilter()
    );
    // saca el total de paginas
    const totalPages = limit === 0 ? 1 : Math.ceil(totalProducts / limit);
    // asigna los enlaces de pagina <- ->
    const prevLink = page > 1 ? `/api/products?page=${page - 1}` : null;
    const nextLink =
      page < totalPages ? `/api/products?page=${page + 1}` : null;

    // respuesta esperada
    const response = {
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink,
      nextLink,
      cartId,
    };

    req.products = response; // seteo productos
    next(); // pasa al siguiente manejador de ruta (views.router.js)
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
};
const getProductById = async (req, res) => {
  try {
   // const manager = req.manager;
    const productId = req.params.pid;
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    //await manager.getProductById(productId);
    const product = await productsService.getProductById(productId);
    if (product) {
      res.status(200).json({
        success: true,
        product: product,
      });
    } else {
      res.status(404).json({ success: false, error: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el producto" });
  }
};

const newProduct = async (req, res) => {
  try {
    //const manager = req.manager;
    const product = req.body;

    const thumbnail = req.file ? req.file.filename : null;
    product.thumbnail = thumbnail;
    if (req.user.role === "admin") {
      const createdProduct = await productsService.newProduct(product);
      res.status(201).json({
        success: true,
        message: "Product created",
        product: createdProduct,
      });
    } else {
      res.status(403).json({ success: false, error: "Unauthorized" });
    }
    //const productId = addedProduct._id.toString();
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    // await manager.addProduct(product, productId);
  } catch (error) {
    //console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al agregar el producto " + error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.pid;
    const updatedFields = req.body;
    const thumbnail = req.file ? req.file.filename : null;
    updatedFields.thumbnail = thumbnail;

    const product = await productsService.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Producto no encontrado" });
    }

    if (user.isPremium && product.owner !== user.email) {
      return res.status(403).json({
        success: false,
        error: "No hay permisos para actualizar este producto",
      });
    }

    const updatedProduct = await productsService.updateProductById(
      id,
      updatedFields,
      { new: true }
    );

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar el producto" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.pid;

    const product = await productsService.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Producto no encontrado" });
    }

    if (user.isPremium && product.owner === user.email) {
      const deletedProduct = await productsService.deleteProductById(id);

      const emailSubject = "Eliminación de Producto";
      const emailContent = `Estimado ${user.first_name}, su producto "${product.name}" ha sido eliminado.`;

      const emailResult = await mailer.sendEmail(
        user.email,
        emailSubject,
        emailContent
      );

      res
        .status(200)
        .json({ success: true, product: deletedProduct, emailResult });
    } else {
      return res.status(403).json({
        success: false,
        error: "No tiene permisos para eliminar este producto",
      });
    }
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar el producto" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  newProduct,
  updateProduct,
  deleteProduct,
};
