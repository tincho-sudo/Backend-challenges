const { ProductManager, generateRandomId } = require("./products.js");
const manager = new ProductManager();

// Agregar productos
manager.addProduct(
  "Producto 1",
  "Descripción del producto 1",
  10.99,
  "imagen1.jpg",
  "001",
  50
);
manager.addProduct(
  "Producto 2",
  "Descripción del producto 2",
  19.99,
  "imagen2.jpg",
  "002",
  20
);
manager.addProduct(
  "Producto 3",
  "Descripción del producto 3",
  5.99,
  "imagen3.jpg",
  generateRandomId(),
  100
);
manager.addProduct(
  "Producto 4",
  "Descripción del producto 4",
  5.99,
  "imagen4.jpg",
  generateRandomId(),
  800
);

// getById
try {
  const product = manager.getProductById("002");
  console.log(`getById: ${JSON.stringify(product)}`);
  console.log("-----------------------------");
} catch (error) {
  console.log(error);
}

// Actualizar los detalles de un producto
// Dejo price y stock en random porque sino me aburro con los mismos valores
try {
  const updatedProduct = manager.updateProduct("001", {
    price: Math.floor(Math.random() * 10),
    stock: Math.floor(Math.random() * 13),
  });
  console.log(`updateById: ${JSON.stringify(updatedProduct)}`);
  console.log("-----------------------------");
} catch (error) {
  console.log(error);
}

// Eliminar un producto por su id
// Claramente el id 003 no existe, es para demostrar que funciona
try {
  let deletedProduct = manager.deleteProductById("003");
  console.log(`deleteById con error: ${JSON.stringify(deletedProduct)}`);
  console.log("-----------------------------");
} catch (error) {
  console.log(error);
  deletedProduct = manager.deleteProductById("002");
  console.log(`deleteById sin error : ${JSON.stringify(deletedProduct)}`);
  console.log("-----------------------------");
}

// Obtener todos los productos
const allProducts = manager.getAllProducts();
console.log(allProducts);


// Todas las funciones devuelven un error en caso de no existir el id o en caso de que no hayan productos en el array