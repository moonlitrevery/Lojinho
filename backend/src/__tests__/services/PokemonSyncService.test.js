jest.mock("../../services/PokeApiService");
jest.mock("../../models/PokemonModel");

const PokeApiService = require("../../services/PokeApiService");
const PokemonModel = require("../../models/PokemonModel");
const PokemonSyncService = require("../../services/PokemonSyncService");

describe("PokemonSyncService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("syncPokemonById deve salvar no banco quando não existe", async () => {
    const mockApiData = {
      id: 25,
      name: "pikachu",
      height: 4,
      types: ["electric"],
      abilities: [{ name: "static" }],
      sprite: "front.png",
      sprite_front_shiny: "shiny.png",
      official_artwork: "art.png",
      stats: [{ name: "speed", value: 90 }]
    };

    PokemonModel.findById.mockResolvedValueOnce(null);
    PokeApiService.getPokemonId.mockResolvedValueOnce(mockApiData);
    PokemonModel.create.mockResolvedValueOnce({ id: 25, name: "pikachu" });

    const result = await PokemonSyncService.syncPokemonById(25);

    expect(PokemonModel.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 25, name: "pikachu" });
  });

  test("syncPokemonById deve retornar existente quando já está no banco", async () => {
    const existingPokemon = { id: 1, name: "bulbasaur" };
    PokemonModel.findById.mockResolvedValueOnce(existingPokemon);

    const result = await PokemonSyncService.syncPokemonById(1);

    expect(PokeApiService.getPokemonId).not.toHaveBeenCalled();
    expect(PokemonModel.create).not.toHaveBeenCalled();
    expect(result).toEqual(existingPokemon);
  });
});