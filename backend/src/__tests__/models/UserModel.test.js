// __tests__/UserModel.test.js
jest.mock("../../db/connection", () => ({
  query: jest.fn(),
}));

const db = require("../../db/connection");
const UserModel = require("../../models/UserModel");

describe("UserModel", () => {
  beforeEach(() => jest.clearAllMocks());

  it("create deve inserir e depois buscar por id", async () => {
    db.query
      .mockResolvedValueOnce([{ insertId: 10 }]) // INSERT
      .mockResolvedValueOnce([[{ id: 10, username: "ash" }]]); // SELECT findById

    const res = await UserModel.create({
      username: "ash",
      email: "ash@kanto.com",
      password_hash: "hash",
    });

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("INSERT INTO users"),
      ["ash", "ash@kanto.com", "hash"]
    );

    expect(db.query).toHaveBeenNthCalledWith(
      2,
      expect.any(String), // SELECT by id (o SQL exato está parcialmente truncado no arquivo)
      [10]
    );

    expect(res).toEqual({ id: 10, username: "ash" });
  });

  it("findAll deve retornar linhas", async () => {
    db.query.mockResolvedValueOnce([[{ id: 1 }, { id: 2 }]]);
    const rows = await UserModel.findAll();
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT id, username, email"));
    expect(rows).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("findByEmail deve buscar por email", async () => {
    db.query.mockResolvedValueOnce([[{ id: 5, email: "a@a.com" }]]);
    const row = await UserModel.findByEmail("a@a.com");
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("FROM users WHERE email = ?"),
      ["a@a.com"]
    );
    expect(row).toEqual({ id: 5, email: "a@a.com" });
  });

  it("update deve atualizar e retornar findById", async () => {
    db.query
      .mockResolvedValueOnce([{}]) // UPDATE
      .mockResolvedValueOnce([[{ id: 9, username: "novo" }]]); // SELECT findById

    const res = await UserModel.update(9, { name: "novo", email: "n@n.com" });

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("UPDATE users SET username = ?, email = ? WHERE id = ?"),
      ["novo", "n@n.com", 9]
    );
    expect(res).toEqual({ id: 9, username: "novo" });
  });

  it("delete deve retornar true quando afetar linhas", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await UserModel.delete(99);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM users WHERE id = ?"),
      [99]
    );
    expect(ok).toBe(true);
  });

  it("userExists deve retornar boolean baseado no findByEmail", async () => {
    // encontrado
    db.query.mockResolvedValueOnce([[{ id: 1 }]]);
    await expect(UserModel.userExists("x@x.com")).resolves.toBe(true);

    // não encontrado
    db.query.mockResolvedValueOnce([[]]);
    await expect(UserModel.userExists("y@y.com")).resolves.toBe(false);
  });
});
