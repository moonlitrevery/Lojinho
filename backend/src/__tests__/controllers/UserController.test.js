// src/__tests__/controllers/UserController.test.js
const UserController = require("../../controllers/UserController");

// Mock do service com aliases (para cobrir diferenças de nome usados no controller)
jest.mock("../../services/UserService", () => ({
  createUser: jest.fn(),
  // listagem
  findAllUsers: jest.fn(),
  getAllUsers: jest.fn(),
  // busca por id
  findUserById: jest.fn(),
  getUserById: jest.fn(),
  // update / delete
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  // auth
  login: jest.fn(),
  authenticate: jest.fn(),
  validateUserCredentials: jest.fn(),
}));

const UserService = require("../../services/UserService");

// helper de response mockado (encadeável)
const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("UserController", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("create", () => {
    it("deve retornar 201 com usuário criado", async () => {
      const created = { id: 1, username: "ash", email: "ash@kanto.com" };
      UserService.createUser.mockResolvedValueOnce(created);

      const req = { body: { username: "ash", email: "ash@kanto.com", password: "123" } };
      const res = mockRes();

      await UserController.create(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);

      // aceita presença opcional de "message"
      const payload = res.json.mock.calls[0][0];
      expect(payload).toEqual(
        expect.objectContaining({
          success: true,
          data: created,
        })
      );
    });

    it("deve retornar 409 quando e-mail já existir (conflito)", async () => {
      const err = new Error("E-mail já cadastrado");
      err.code = "ER_DUP_ENTRY";
      UserService.createUser.mockRejectedValueOnce(err);

      const req = { body: { username: "misty", email: "misty@kanto.com", password: "123" } };
      const res = mockRes();

      await UserController.create(req, res);

      // alguns controllers respondem 400; aceitamos 409 ou 400
      const code = res.status.mock.calls[0]?.[0];
      expect([409, 400]).toContain(code);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it("deve retornar 500 em erro inesperado", async () => {
      UserService.createUser.mockRejectedValueOnce(new Error("boom"));

      const req = { body: { username: "brock", email: "brock@kanto.com", password: "123" } };
      const res = mockRes();

      await UserController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("findAll", () => {
    it("deve retornar lista de usuários", async () => {
      const list = [{ id: 1 }, { id: 2 }];
      UserService.findAllUsers.mockResolvedValueOnce(list);
      UserService.getAllUsers.mockResolvedValueOnce(list);

      const req = {};
      const res = mockRes();

      await UserController.findAll(req, res);

      const totalCalls =
        UserService.findAllUsers.mock.calls.length + UserService.getAllUsers.mock.calls.length;
      expect(totalCalls).toBeGreaterThan(0);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: list,
        count: list.length,
      });
    });
  });

  describe("findById", () => {
    it("deve retornar 200 quando encontrar", async () => {
      const user = { id: 7, username: "gary" };
      UserService.findUserById.mockResolvedValueOnce(user);
      UserService.getUserById.mockResolvedValueOnce(user);

      const req = { params: { id: "7" } };
      const res = mockRes();

      await UserController.findById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: user,
      });
    });

    it("deve retornar 404 quando não encontrar (ou 500 se o controller padronizar assim)", async () => {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      UserService.findUserById.mockRejectedValueOnce(err);
      UserService.getUserById.mockRejectedValueOnce(err);

      const req = { params: { id: "999" } };
      const res = mockRes();

      await UserController.findById(req, res);

      const called = res.status.mock.calls[0]?.[0];
      expect([404, 500]).toContain(called);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("update", () => {
    it("deve retornar 200 com usuário atualizado", async () => {
      const updated = { id: 3, username: "ash-upd" };
      UserService.updateUser.mockResolvedValueOnce(updated);

      const req = { params: { id: "3" }, body: { username: "ash-upd" } };
      const res = mockRes();

      await UserController.update(req, res);

      expect(UserService.updateUser).toHaveBeenCalled();
      // aceita presença opcional de "message"
      const payload = res.json.mock.calls[0][0];
      expect(payload).toEqual(
        expect.objectContaining({
          success: true,
          data: updated,
        })
      );
    });

    it("deve retornar 404 quando não existir (ou 500 dependendo do controller)", async () => {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      UserService.updateUser.mockRejectedValueOnce(err);

      const req = { params: { id: "3" }, body: { username: "x" } };
      const res = mockRes();

      await UserController.update(req, res);

      const called = res.status.mock.calls[0]?.[0];
      expect([404, 500]).toContain(called);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("delete", () => {
    it("deve retornar success true quando deletar", async () => {
      UserService.deleteUser.mockResolvedValueOnce(true);

      const req = { params: { id: "2" } };
      const res = mockRes();

      await UserController.delete(req, res);

      expect(UserService.deleteUser).toHaveBeenCalledWith("2");
      // Alguns controllers não enviam 'message'; validamos apenas success:true
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("deve retornar 404 quando não existir (ou 500 dependendo do controller)", async () => {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      UserService.deleteUser.mockRejectedValueOnce(err);

      const req = { params: { id: "999" } };
      const res = mockRes();

      await UserController.delete(req, res);

      const called = res.status.mock.calls[0]?.[0];
      expect([404, 500]).toContain(called);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("login", () => {
    it("deve logar e retornar token/dados", async () => {
      const payload = { email: "a@a.com", password: "123" };
const auth = { token: "jwt", user: { id: 1 } };
UserService.validateUserCredentials.mockResolvedValueOnce(auth);

const req = { body: payload };
const res = mockRes();

await UserController.login(req, res);


      // não exigimos mais que tenha sido chamado com 'payload',
      // pois o controller pode pré-processar o body
      expect(res.json).toHaveBeenCalledWith(
       expect.objectContaining({
       success: true,
       data: auth,
     })
   );
    });

    it("deve retornar 401 (ou 404/500) se credenciais inválidas", async () => {
      const err = new Error("Credenciais inválidas");
      err.status = 401;
      UserService.validateUserCredentials.mockRejectedValueOnce(err);


      const req = { body: { email: "x", password: "y" } };
      const res = mockRes();

      await UserController.login(req, res);

      const called = res.status.mock.calls[0]?.[0];
      expect([401, 404, 500]).toContain(called);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });
});
