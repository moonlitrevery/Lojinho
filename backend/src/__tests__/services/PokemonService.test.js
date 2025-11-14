// src/__tests__/services/PokemonService.test.js
jest.mock("../../services/PokeApiService", () => ({
  getAllPokemons: jest.fn(),
  getPokemonId: jest.fn(),
}));

jest.mock("../../models/PokemonModel", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  getCount: jest.fn(),
  searchByName: jest.fn(),
}));

const API = require("../../services/PokeApiService");
const PokemonModel = require("../../models/PokemonModel");
const PokemonService = require("../../services/PokemonService");


describe("PokemonService", () => {
  afterEach(() => jest.clearAllMocks());

  test("getAllPokemons delega ao PokeApiService quando banco retorna vazio", async () => {
    const list = { results: [{ name: "bulbasaur" }] };

    PokemonModel.findAll.mockResolvedValueOnce([]); // força fallback
    API.getAllPokemons.mockResolvedValueOnce(list);

    const res = await PokemonService.getAllPokemons();

    expect(PokemonModel.findAll).toHaveBeenCalledTimes(1);
    expect(API.getAllPokemons).toHaveBeenCalledTimes(1);
    expect(res).toEqual(list.results);
  });


  test("getPokemonId retorna o pokemon quando id é válido", async () => {
    const pikachu = { id: 25, name: "pikachu" };
    PokemonModel.findById.mockResolvedValueOnce(pikachu);

    const res = await PokemonService.getPokemonId("25");

    expect(PokemonModel.findById).toHaveBeenCalledWith("25");
    expect(API.getPokemonId).not.toHaveBeenCalled();
    expect(res).toBe(pikachu);
  });


  test("getPokemonId lança erro quando id é vazio (exercita validação atual)", async () => {
    await expect(PokemonService.getPokemonId("")).rejects.toThrow("Pokémon não encontrado");
  });
});
