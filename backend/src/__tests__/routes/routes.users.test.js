// __tests__/routes.users.test.js
const express = require("express");
const request = require("supertest");

// mock de express-validator para os testes de rota
jest.mock("express-validator", () => {
  const createChain = () => {
    // isso é o middleware que o Express espera
    const middleware = (req, res, next) => {
      // nos testes, só queremos que ele deixe passar
      next();
    };

    // métodos encadeáveis que retornam o próprio middleware
    middleware.isLength = () => middleware;
    middleware.isAlphanumeric = () => middleware;
    middleware.withMessage = () => middleware;
    middleware.isEmail = () => middleware;
    middleware.normalizeEmail = () => middleware;
    middleware.notEmpty = () => middleware;
    middleware.optional = () => middleware;
    middleware.isInt = () => middleware;

    return middleware;
  };

  return {
    body: () => createChain(),
    param: () => createChain(),
    validationResult: () => ({
      isEmpty: () => true,  // sempre sem erros
      array: () => [],
    }),
  };
});

// mock do controller para não executar lógica real
jest.mock("../../controllers/UserController", () => ({
  findAll: jest.fn((req, res) => res.json({ list: [] })),
  findById: jest.fn((req, res) => res.json({ id: req.params.id })),
  update: jest.fn((req, res) => res.json({ updated: true })),
  create: jest.fn((req, res) => res.status(201).json({ created: true })),
  delete: jest.fn((req, res) => res.json({ deleted: true })),
  login: jest.fn((req, res) => res.json({ token: "x" })),
}));

const router = require("../../routes/users");
const UserController = require("../../controllers/UserController");

describe("routes/users", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  beforeEach(() => { jest.spyOn(console, "log").mockImplementation(() => {}); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("GET /users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(UserController.findAll).toHaveBeenCalled();
  });

  test("GET /users/:id", async () => {
    const res = await request(app).get("/users/3");
    expect(res.status).toBe(200);
    expect(UserController.findById).toHaveBeenCalled();
  });

  test("PUT /users/:id", async () => {
    const res = await request(app).put("/users/3").send({ username: "x" });
    expect(res.status).toBe(200);
    expect(UserController.update).toHaveBeenCalled();
  });

test("POST /users/register", async () => {
  const res = await request(app)
    .post("/users/register")
    .send({
      username: "ash",
      email: "ash@kanto.com",
      password: "abc123"
    });

  expect(res.status).toBe(201);
  expect(UserController.create).toHaveBeenCalled();
});


  test("DELETE /users/:id", async () => {
    const res = await request(app).delete("/users/9");
    expect(res.status).toBe(200);
    expect(UserController.delete).toHaveBeenCalled();
  });

test("POST /users/login", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({
      email: "ash@kanto.com",
      password: "abc123"
    });

  expect(res.status).toBe(200);
  expect(UserController.login).toHaveBeenCalled();
});

});
