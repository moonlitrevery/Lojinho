// __tests__/routes.pokemons.test.js
const express = require("express");
const request = require("supertest");

// mock do controller para não executar lógica real
jest.mock("../../controllers/PokemonController", () => ({
  getAllPokemons: jest.fn((req, res) => res.json({ ok: true })),
  getPokemonId: jest.fn((req, res) => res.json({ id: req.params.id })),
  searchPokemon: jest.fn((req, res) => res.json({ results: [] })),
  getStats: jest.fn((req, res) => res.json({ stats: true })),
}));

const router = require("../../routes/pokemons");
const PokemonController = require("../../controllers/PokemonController");

describe("routes/pokemons", () => {
  const app = express();
  app.use(router);

  beforeEach(() => { jest.spyOn(console, "log").mockImplementation(() => {}); });
  afterEach(() => { jest.restoreAllMocks(); });

  it("GET /pokemon deve chamar controller.getAllPokemons", async () => {
    const res = await request(app).get("/pokemon");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(PokemonController.getAllPokemons).toHaveBeenCalled();
  });

  it("GET /pokemon/:id deve chamar controller.getPokemonId", async () => {
    const res = await request(app).get("/pokemon/25");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "25" });
    expect(PokemonController.getPokemonId).toHaveBeenCalled();
  });
});
