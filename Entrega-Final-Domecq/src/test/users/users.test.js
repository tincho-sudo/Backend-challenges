const supertest = require("supertest");
const chai = require("chai");
const { PORT } = require("../../config/env");
const expect = chai.expect;
const request = supertest(`http://localhost:${PORT}`);
const { isValidPassword } = require("../../utils");
let cookie;
describe("Testing de Usuarios", () => {
  describe("Test de register", () => {
    it("El endpoint POST /api/users/register debe crear un usuario correctamente", async () => {
      const userMock = {
        first_name: "testingFirstName2",
        last_name: "testingLastName2",
        age: 20,
        email: "email2@testing.com.ar",
        password: "testingPassword2",
        role: "admin",
      };
      const { statusCode, ok, _body } = await request
        .post("/api/users/register")
        .send(userMock);

      // Le borra la password porque al hashearla nunca va a poder confirmar la igualdad
      delete userMock.password;
      expect(statusCode).to.equal(201);
      expect(ok).to.equal(true);
      console.log("User Mock: ", userMock);
      // Verifica que el cuerpo de la respuesta incluya el usuario creado
      expect(_body).to.have.property("user");
      // Verifica las propiedades del usuario
      expect(_body.user).to.deep.include(userMock);
    });
  });
  describe("Test de login", () => {
    it("El endpoint POST /api/users/login debe iniciar sesion con un usuario correctamente", async () => {
      const userCredentials = {
        email: "email@testing.com.ar",
        password: "testingPassword",
      };
      const { statusCode, ok, _body, headers } = await request
        .post("/api/users/login")
        .send(userCredentials);
      cookie = headers["set-cookie"];

      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      // Verifica que el cuerpo de la respuesta incluya el usuario creado
      expect(_body).to.have.property("user");
      // Verifica las propiedades del usuario
      if (!isValidPassword(_body.user, userCredentials.password)) {
        expect(_body.user).to.deep.include(userCredentials);
      }
    });
  });
  after(async () => {
    const response = await request.post("/api/users/logout");
    cookie = response.headers["set-cookie"];
  });
  describe("Test de current", () => {
    it("El endpoint GET /api/users/current devolver la sesion actual correctamente", async () => {
      const userCredentials = {
        email: "email@testing.com.ar",
        password: "testingPassword",
      };
      let { statusCode, ok, _body, headers } = await request
        .post("/api/users/login")
        .send(userCredentials);
      cookie = headers["set-cookie"];

      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      // Verifica que el cuerpo de la respuesta incluya el usuario creado
      expect(_body).to.have.property("user");
      // Verifica las propiedades del usuario
      if (!isValidPassword(_body.user, userCredentials.password)) {
        expect(_body.user).to.deep.include(userCredentials);
      }

      statusCode,
        ok,
        _body,
        (headers = await request.get("/api/users/current"));
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      expect(_body).to.have.property("user");
      if (!isValidPassword(_body.user, userCredentials.password)) {
        expect(_body.user).to.deep.include(userCredentials);
      }
    });
  });
  after(async () => {
    const response = await request.post("/api/users/logout");
    cookie = response.headers["set-cookie"];
  });
});
