const API = require("./PokeApiService");

class PokemonService {
  async getAllPokemons() {
    return await API.getAllPokemons();
  }

  async getPokemonId(pokemonId) {
    const pokemon = await API.getPokemonId(pokemonId);
    if (!pokemonId) {
      throw new Error("Pokémon não encontrado");
    }
    return pokemon;
  }
}

module.exports = new PokemonService();
