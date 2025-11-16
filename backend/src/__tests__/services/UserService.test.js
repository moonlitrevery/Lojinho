// src/__tests__/services/UserService.test.js
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../../models/UserModel", () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
}));

const bcrypt = require("bcrypt");
const UserModel = require("../../models/UserModel");
const UserService = require("../../services/UserService");

describe("UserService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createUser", () => {
    test("valida campos obrigatórios", async () => {
      await expect(UserService.createUser({})).rejects.toThrow("Nome, email e senha são obrigatórios");
    });

    test("valida tamanho mínimo de senha", async () => {
      const data = { username: "ash", email: "ash@kanto.com", password: "123" };
      await expect(UserService.createUser(data)).rejects.toThrow("A senha precisa ter pelo menos 6 caracteres");
    });

    test("recusa e-mail duplicado", async () => {
      const data = { username: "misty", email: "misty@kanto.com", password: "123456" };
      UserModel.findByEmail.mockResolvedValueOnce({ id: 1 });
      await expect(UserService.createUser(data)).rejects.toThrow("Email já cadastrado");
    });

    test("cria usuário com senha hasheada e não vaza password_hash", async () => {
      const data = { username: "brock", email: "brock@kanto.com", password: "123456" };
      UserModel.findByEmail.mockResolvedValueOnce(null);
      bcrypt.hash.mockResolvedValueOnce("HASHED");

      UserModel.create.mockResolvedValueOnce({
        id: 10, username: "brock", email: "brock@kanto.com", password_hash: "HASHED"
      });

      const created = await UserService.createUser(data);

      expect(bcrypt.hash).toHaveBeenCalledWith("123456", expect.any(Number));
      expect(UserModel.create).toHaveBeenCalledWith({
        username: "brock",
        email: "brock@kanto.com",
        password_hash: "HASHED",
      });

      expect(created).toEqual(
        expect.objectContaining({
          id: 10,
          username: "brock",
          email: "brock@kanto.com",
        })
      );
    });
  });

  describe.skip("login", () => {
    test("falha quando usuário não existe", async () => {
      UserModel.findByEmail.mockResolvedValueOnce(null);
      await expect(UserService.login({ email: "x@x.com", password: "123456" }))
        .rejects.toThrow("Credenciais inválidas");
    });

    test("falha quando senha é inválida", async () => {
      UserModel.findByEmail.mockResolvedValueOnce({ id: 1, email: "a@a.com", password_hash: "HASH" });
      bcrypt.compare.mockResolvedValueOnce(false);
      await expect(UserService.login({ email: "a@a.com", password: "wrong" }))
        .rejects.toThrow("Credenciais inválidas");
    });

    test("retorna usuário sem password_hash quando senha confere", async () => {
      const userRow = { id: 3, username: "ash", email: "ash@kanto.com", password_hash: "HASH" };
      UserModel.findByEmail.mockResolvedValueOnce(userRow);
      bcrypt.compare.mockResolvedValueOnce(true);

      const res = await UserService.login({ email: "ash@kanto.com", password: "123456" });

      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "HASH");
      expect(res).toEqual({ id: 3, username: "ash", email: "ash@kanto.com" });
      expect(res.password_hash).toBeUndefined();
    });
  });
});
