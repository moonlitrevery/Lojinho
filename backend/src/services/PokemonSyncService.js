const PokeApiService = require("./PokeApiService");
const PokemonModel = require("../models/PokemonModel");

class PokemonSyncService {
  constructor() {
    this.pokeApi = PokeApiService;
    this.pokemonModel = PokemonModel;
  }

  async syncPokemonById(pokemonId) {
    try {
      console.log(`Sincronizando Pokémon ID: ${pokemonId}`);
      
      const existingPokemon = await this.pokemonModel.findById(pokemonId);
      if (existingPokemon) {
        console.log(`Pokémon ${pokemonId} já existe no banco local`);
        return existingPokemon;
      }

      const apiData = await this.pokeApi.getPokemonId(pokemonId);
      
      const pokemonData = this.transformApiDataForDB(apiData);
      
      const savedPokemon = await this.pokemonModel.create(pokemonData);
      
      console.log(`Pokémon ${pokemonId} sincronizado com sucesso`);
      return savedPokemon;
    } catch (error) {
      console.error(`Erro ao sincronizar Pokémon ${pokemonId}:`, error.message);
      throw new Error(`Falha na sincronização do Pokémon ${pokemonId}`);
    }
  }

  async syncPokemonByIds(pokemonIds) {
    const results = {
      successful: [],
      failed: []
    };

    for (const id of pokemonIds) {
      try {
        const pokemon = await this.syncPokemonById(id);
        results.successful.push(pokemon);
      } catch (error) {
        results.failed.push({ id, error: error.message });
      }
    }

    return results;
  }

  async syncPokemonByRange(startId, endId) {
    const pokemonIds = [];
    for (let i = startId; i <= endId; i++) {
      pokemonIds.push(i);
    }
    
    return await this.syncPokemonByIds(pokemonIds);
  }

  async syncPokemonFromList(limit = 50, offset = 0) {
    try {
      console.log(`Sincronizando lista de Pokémon - Limit: ${limit}, Offset: ${offset}`);
      
      const apiList = await this.pokeApi.getAllPokemons(limit, offset);
      const pokemonIds = apiList.results.map(pokemon => {
        const urlParts = pokemon.url.split('/');
        return parseInt(urlParts[urlParts.length - 2]);
      });

      return await this.syncPokemonByIds(pokemonIds);
    } catch (error) {
      console.error('Erro ao sincronizar lista de Pokémon:', error);
      throw error;
    }
  }

  transformApiDataForDB(apiData) {
    return {
      id: apiData.id,
      name: apiData.name,
      height: apiData.height,
      weight: apiData.weight,
      base_experience: apiData.base_experience,
      types: JSON.stringify(apiData.types),
      abilities: JSON.stringify(apiData.abilities),
      sprite_front_default: apiData.sprite,
      sprite_front_shiny: apiData.sprite_front_shiny || null,
      sprite_official_artwork: apiData.official_artwork,
      stats: JSON.stringify(apiData.stats)
    };
  }

  async updateOutdatedPokemon(daysThreshold = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);
      
      console.log('Atualização em lote não implementada - requer campo updated_at');
      return { updated: 0 };
    } catch (error) {
      console.error('Erro ao atualizar Pokémon desatualizados:', error);
      throw error;
    }
  }
}

module.exports = new PokemonSyncService();