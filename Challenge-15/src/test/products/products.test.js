const supertest = require("supertest");
const chai = require("chai");
const { PORT } = require("../../config/env");
const expect = chai.expect;
const request = supertest(`http://localhost:${PORT}`);

let cookie;

describe("Testing de Productos", () => {
  before(async () => {
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
      const productMock = {
        title: `productTesting`,
        description: `Descripción productTesting`,
        price: 5.99,
        thumbnail: `imageTesting.jpg`,
        stock: 800,
        categ: "Home",
      };
      const { statusCode, ok, _body } = await request
        .post("/api/products/")
        .send(productMock);
      // Verifica que el cuerpo de la respuesta NO incluya un producto
      expect(_body).to.not.have.property("product");
      expect(statusCode).to.equal(500);
    });
  });
  describe("Test de new product con admin", () => {
    it("El endpoint POST /api/products/ debe crear un producto correctamente.", async () => {
      const userMock = {
        email: "email@testing.com.ar",
        password: "testingPassword",
      };

      const result = await request.post("/api/users/login").send(userMock);
      const cookieResult = result.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql("connect.sid");
      expect(cookie.value).to.be.ok.and.not.eql("");

      const productMock = {
        title: `productTesting`,
        description: `Descripción productTesting`,
        price: 5.99,
        thumbnail: `./imageTesting.jpg`,
        stock: 800,
        categ: "Home",
      };

      const { statusCode, ok, body } = await request
        .post("/api/products/")
        .field("title", productMock.title)
        .field("description", productMock.description)
        .field("price", productMock.price)
        .attach("thumbnail", productMock.thumbnail)
        .field("stock", productMock.stock)
        .field("categ", productMock.categ)
        .set("Cookie", cookie);
      expect(_body).to.have.property("product");
      expect(_body.product).to.deep.include(productMock);
      expect(statusCode).to.equal(201);
      expect(ok).to.equal(true);
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
    it.only("El endpoint DELETE /api/products/ debe eliminar un producto correctamente por id", async () => {
      const userMock = {
        email: "email@testing.com.ar",
        password: "testingPassword",
      };

      const result = await request.post("/api/users/login").send(userMock);

      const productMock = {
        title: "Producto de prueba",
        description: "Descripción de prueba",
        price: 10.99,
        thumbnail: "imagen.jpg",
        stock: 100,
        categ: "Electro",
        owner: "admin",
      };

      const createProduct = await request
        .post("/api/products/")
        .field("title", productMock.title)
        .field("description", productMock.description)
        .field("price", productMock.price)
        .attach("thumbnail", productMock.thumbnail)
        .field("stock", productMock.stock)
        .field("categ", productMock.categ)
        .field("owner", productMock.owner)
        .set("Cookie", cookie);
      console.log(cookie);
      const productId = createProduct.body.product._id;
      console.log(productId);

      const { statusCode, ok, _body } = await request
        .delete(`/api/products/${productId}`)
        .set("Cookie", cookie);

      expect(statusCode).to.equal(200);
      expect(_body.success).to.be.true;
    });
  });
});
