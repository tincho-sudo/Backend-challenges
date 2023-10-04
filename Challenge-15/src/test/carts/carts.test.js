const supertest = require("supertest");
const chai = require("chai");
const { PORT } = require("../../config/env");
const expect = chai.expect;
const request = supertest(`http://localhost:${PORT}`);

describe("Testing de Carts", () => {
  describe("Test de new cart", () => {
    it("El endpoint POST /api/carts/ debe crear un carrito correctamente", async () => {
      const { statusCode, ok } = await request.post("/api/carts/");
      expect(statusCode).to.equal(201);
      expect(ok).to.equal(true);
    });
  });
});
