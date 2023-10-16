const supertest = require("supertest");
const chai = require("chai");
const { PORT } = require("../../config/env");
const expect = chai.expect;
const request = supertest(`http://localhost:${PORT}`);

describe("Testing de Carts", () => {
  before(async () => {
    const userCredentials = {
      email: "martin_a@hotmail.com",
      password: "a",
    };
    const response = await request
      .post("/api/users/login")
      .send(userCredentials);
    cookie = response.headers["set-cookie"];
  });
  describe("Test de new cart", () => {
    it("El endpoint POST /api/carts/ debe crear un carrito correctamente", async () => {
      const { statusCode, ok } = await request.post("/api/carts/");
      expect(statusCode).to.equal(201);
      expect(ok).to.equal(true);
    });
  });

  describe("Test de get cart", () => {
    let cartId;

    before(async () => {
      const { body } = await request.post("/api/carts");

      cartId = body.cart._id;
    });

    it("El endpoint GET /api/carts/:cid debe traer un carrito correctamente por id", async () => {
      const { statusCode, ok } = await request
        .get(`/api/carts/${cartId}`)
        .set("Cookie", cookie);
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
    });
  });
  describe("Test de add product to cart", () => {
    let cartId;

    before(async () => {
      const response = await request.post("/api/carts");
      cartId = response.body.cart._id;
    });

    it("El endpoint POST /api/carts/:cid/:pid debe añadir un producto a un carrito", async () => {
      const productId = "649d250bdbbe478c11434c4f";

      await request
        .post(`/api/carts/${cartId}/product/${productId}`)
        .set("Cookie", cookie);

      const { body, statusCode, ok } = await request.get(
        `/api/carts/${cartId}`
      );
      console.log(body);
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      expect(body).to.have.property("products");
    });
  });
});
