const supertest = require("supertest");
const chai = require("chai");
const { PORT } = require("../../config/env");
const expect = chai.expect;
const request = supertest(`http://localhost:${PORT}`);
const Product = require("../../dao/mongo/models/product.model");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../../db/tests-db-connection");

let cookie;

describe("Testing de Productos", () => {
  before(async () => {
    await connectToDatabase();
    const userCredentials = {
      email: "email@testing.com.ar",
      password: "testingPassword",
    };
    const response = await request
      .post("/api/users/login")
      .send(userCredentials);
    cookie = response.headers["set-cookie"];
  });
  describe("Test de new product sin admin", () => {
    it("El endpoint POST /api/products/ debe fallar en crear un producto.", async () => {
      await request.post("/api/users/logout");
      const userCredentials = {
        email: "martin_a@hotmail.com",
        password: "a",
      };
      const response = await request
        .post("/api/users/login")
        .send(userCredentials);
      cookie = response.headers["set-cookie"];
      const productMock = {
        title: "Producto de prueba",
        description: "Descripción de prueba",
        price: 10.99,
        thumbnail: "imagen.jpg",
        stock: 100,
        categ: "Electro",
        owner: "martin_a@hotmail.com",
      };

      const { statusCode, ok, body } = await request
        .post("/api/products/")
        .field("title", productMock.title)
        .field("description", productMock.description)
        .field("price", productMock.price)
        .attach("thumbnail", productMock.thumbnail)
        .field("stock", productMock.stock)
        .field("categ", productMock.categ)
        .field("owner", productMock.owner)
        .set("Cookie", cookie);
      // Verifica que el cuerpo de la respuesta NO incluya un producto
      console.log(body);
      expect(body).to.not.have.property("product");
      expect(statusCode).to.equal(403);
    });
  });
  describe("Test de new product con admin", () => {
    it("El endpoint POST /api/products/ debe crear un producto correctamente.", async () => {
      const productMock = {
        title: "Producto de prueba",
        description: "Descripción de prueba",
        price: 10.99,
        thumbnail: "imagen.jpg",
        stock: 100,
        categ: "Electro",
        owner: "email@testing.com.ar",
      };

      const { statusCode, ok, body } = await request
        .post("/api/products/")
        .field("title", productMock.title)
        .field("description", productMock.description)
        .field("price", productMock.price)
        .attach("thumbnail", productMock.thumbnail)
        .field("stock", productMock.stock)
        .field("categ", productMock.categ)
        .field("owner", productMock.owner)
        .set("Cookie", cookie);
      console.log("body product: ", body);
      expect(body).to.have.property("product");
      expect(body.product).to.deep.include(productMock);
      expect(statusCode).to.equal(201);
      expect(ok).to.equal(true);
      console.log(body.product);
    });
  });

  describe("Test de get products", () => {
    it("El endpoint GET /api/products/ debe traer todos los productos listados correctamente (de una pagina)", async () => {
      const { statusCode, ok, _body } = await request.get("/api/products/");
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      expect(_body).to.have.property("products");
      console.log("Productos obtenidos:", _body.products);
    });
  });
  describe("Test de delete products", () => {
    it("El endpoint DELETE /api/products/ debe eliminar un producto correctamente por id", async () => {
      const productMock = {
        title: "Producto de prueba2",
        description: "Descripción de prueba2",
        price: "10.99",
        thumbnail: "imagen.jpg",
        stock: "100",
        categ: "Electro",
        owner: "email@testing.com.ar",
      };

      const { body } = await request
        .post("/api/products/")
        .field("title", productMock.title)
        .field("description", productMock.description)
        .field("price", productMock.price)
        .attach("thumbnail", productMock.thumbnail)
        .field("stock", productMock.stock)
        .field("categ", productMock.categ)
        .field("owner", productMock.owner)
        .set("Cookie", cookie);
      console.log(body);

      const product = await Product.findOne({
        title: productMock.title,
        description: productMock.description,
      });

      console.log(product);
      const productId = product._id.toString();
      console.log("Id a eliminar: ", productId);
      const { statusCode, ok, _body } = await request
        .delete(`/api/products/${productId}`)
        .set("Cookie", cookie);
      console.log(_body);
      expect(statusCode).to.equal(200);
      expect(_body.success).to.be.true;
    });
  });
  after(async () => {
    await disconnectFromDatabase();
  });
});
