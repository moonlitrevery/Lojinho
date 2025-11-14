const API = require("./PokeApiService");
const PokemonModel = require("../models/PokemonModel");

class PokemonService {
  async getAllPokemons(limit = 50, offset = 0) {
    try {
      // Converte para números e aplica valores padrão
      const parsedLimit = parseInt(limit) || 50;
      const parsedOffset = parseInt(offset) || 0;
      
      // Tenta buscar do banco com paginação
      let pokemons = await PokemonModel.findAll(parsedLimit, parsedOffset);
      
      // Se não tem pokémons no banco, busca da API
      if (pokemons.length === 0) {
        const apiResult = await API.getAllPokemons();
        pokemons = apiResult.results || [];
        
        // Aplica limite e offset manualmente para a resposta da API
        pokemons = pokemons.slice(parsedOffset, parsedOffset + parsedLimit);
      }
      
      return pokemons;
    } catch (error) {
      console.error("Error in PokemonService.getAllPokemons:", error);
      throw error;
    }
  }

  async getPokemonId(pokemonId) {
    try {
      if (!pokemonId) {
        throw new Error("Pokémon não encontrado");
      }
      
      // Tenta buscar do banco primeiro
      let pokemon = await PokemonModel.findById(pokemonId);
      
      if (!pokemon) {
        // Se não existe, busca da API e salva
        pokemon = await API.getPokemonId(pokemonId);
        await PokemonModel.create(pokemon);
      }
      
      return pokemon;
    } catch (error) {
      console.error("Error in PokemonService.getPokemonId:", error);
      throw new Error("Pokémon não encontrado");
    }
  }

  async searchPokemon(name) {
    try {
      // Busca no banco por nome
      const pokemons = await PokemonModel.searchByName(name);
      return pokemons;
    } catch (error) {
      console.error("Error in PokemonService.searchPokemon:", error);
      throw new Error("Erro ao buscar pokémon");
    }
  }

  async getPokemonCount() {
    try {
      return await PokemonModel.getCount();
    } catch (error) {
      console.error("Error in PokemonService.getPokemonCount:", error);
      return 0;
    }
  }
}

module.exports = new PokemonService();