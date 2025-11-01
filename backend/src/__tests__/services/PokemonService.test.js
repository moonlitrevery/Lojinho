// src/__tests__/services/PokemonService.test.js
jest.mock("../../services/PokeApiService", () => ({
  getAllPokemons: jest.fn(),
  getPokemonId: jest.fn(),
}));

const API = require("../../services/PokeApiService");
const PokemonService = require("../../services/PokemonService");

describe("PokemonService", () => {
  afterEach(() => jest.clearAllMocks());

  test("getAllPokemons delega ao PokeApiService", async () => {
    const list = { results: [{ name: "bulbasaur" }] };
    API.getAllPokemons.mockResolvedValueOnce(list);

    const res = await PokemonService.getAllPokemons();

    expect(API.getAllPokemons).toHaveBeenCalledTimes(1);
    expect(res).toBe(list);
  });

  test("getPokemonId retorna o pokemon quando id é válido", async () => {
    const pikachu = { id: 25, name: "pikachu" };
    API.getPokemonId.mockResolvedValueOnce(pikachu);

    const res = await PokemonService.getPokemonId("25");

    expect(API.getPokemonId).toHaveBeenCalledWith("25");
    expect(res).toBe(pikachu);
  });

  test("getPokemonId lança erro quando id é vazio (exercita validação atual)", async () => {
    // OBS: a implementação atual chama a API ANTES de validar id e depois lança erro
    API.getPokemonId.mockResolvedValueOnce({});

    await expect(PokemonService.getPokemonId("")).rejects.toThrow("Pokémon não encontrado");
    expect(API.getPokemonId).toHaveBeenCalledWith("");
  });
});
