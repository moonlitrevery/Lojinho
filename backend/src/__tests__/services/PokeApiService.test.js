// src/__tests__/services/PokeApiService.test.js
const PokeApi = require("../../services/PokeApiService");

describe("PokeApiService", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, "log").mockImplementation(() => {}); // silencia logs do service
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getAllPokemons: retorna JSON quando ok", async () => {
    const mockJson = { results: [{ name: "bulbasaur" }] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const res = await PokeApi.getAllPokemons();

    expect(fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon");
    expect(res).toEqual(mockJson);
  });

  test("getAllPokemons: lança erro quando response não é ok", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 503 });
    await expect(PokeApi.getAllPokemons()).rejects.toThrow("Response status: 503");
  });

  test("getPokemonId: retorna dados transformados", async () => {
    const apiData = {
      id: 25,
      name: "pikachu",
      height: 4,
      weight: 60,
      base_experience: 112,
      abilities: [{ ability: { name: "static" }, is_hidden: false }],
      types: [{ type: { name: "electric" } }],
      moves: [{ move: { name: "thunderbolt" } }],
      sprites: {
        front_default: "front.png",
        other: { "official-artwork": { front_default: "art.png" } },
      },
      stats: [{ stat: { name: "speed" }, base_stat: 90 }],
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(apiData),
    });

    const res = await PokeApi.getPokemonId(25);

    expect(fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/25");
    // checamos alguns campos-chave da transformação
    expect(res).toEqual(
      expect.objectContaining({
        id: 25,
        name: "pikachu",
        height: 4,
        weight: 60,
        base_experience: 112,
        abilities: [{ name: "static", is_hidden: false }],
        types: ["electric"],
        sprite: "front.png",
        official_artwork: "art.png",
        stats: [{ name: "speed", value: 90 }],
      })
    );
  });

  test("getPokemonId: erro quando fetch falha", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(PokeApi.getPokemonId(9999)).rejects.toThrow(/Failed to fetch Pokémon: .*404/);
  });
});
