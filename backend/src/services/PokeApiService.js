class PokeAPI {
  constructor() {
    this.baseURL = "https://pokeapi.co/api/v2/";
  }
  async getAllPokemons() {
    try {
      const response = await fetch(`${this.baseURL}pokemon`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getPokemonId(pokemonId) {
    try {
      const response = await fetch(`${this.baseURL}pokemon/${pokemonId}`);
      if (!response.ok) {
        throw new Error(`Pokemon not found: ${response.status}`);
      }
      const pokemonData = await response.json();
      return this.transformData(pokemonData);
    } catch (err) {
      throw new Error(`Failed to fetch Pokémon: ${err.message}`);
    }
  }

  transformData(apiData) {
    return {
      id: apiData.id,
      name: apiData.name,
      height: apiData.height,
      weight: apiData.weight,
      base_experience: apiData.base_experience,
      types: apiData.types.map((t) => t.type.name),
      abilities: apiData.abilities.map((a) => ({
        name: a.ability.name,
        is_hidden: a.is_hidden,
      })),
      sprite: apiData.sprites.front_default,
      official_artwork:
        apiData.sprites.other["official-artwork"]?.front_default,
      stats: apiData.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
  }
}

module.exports = new PokeAPI();
