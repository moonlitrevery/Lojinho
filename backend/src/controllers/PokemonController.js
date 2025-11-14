const PokemonService = require("../services/PokemonService");

class PokemonController {
  async getAllPokemons(req, res) {
    try {
      const { limit, offset } = req.query || {};
      const pokemons = await PokemonService.getAllPokemons(limit, offset);

      res.json({
        success: true,
        data: pokemons,
        count: pokemons.length,
        pagination: {
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0
        }
      });
    } catch (err) {
      console.error("Error in PokemonController.getAllPokemons", err);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar pokémons"
      });
    }
  }

  async getPokemonId(req, res) {
    try {
      const pokemon = await PokemonService.getPokemonId(req.params.id);

      res.json({
        success: true,
        data: pokemon,
      });
    } catch (err) {
      if (err.message === "Pokémon não encontrado") {
        return res.status(404).json({
          success: false,
          error: err.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Erro ao buscar pokémon",
      });
    }
  }

  async searchPokemon(req, res) {
    try {
      const { name } = req.query;
      if (!name) {
        return res.status(400).json({
          success: false,
          error: "Parâmetro 'name' é obrigatório"
        });
      }

      const pokemons = await PokemonService.searchPokemon(name);
      
      res.json({
        success: true,
        data: pokemons,
        count: pokemons.length
      });
    } catch (err) {
      console.error("Error in PokemonController.searchPokemon", err);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar pokémon"
      });
    }
  }

  async getStats(req, res) {
    try {
      const count = await PokemonService.getPokemonCount();
      
      res.json({
        success: true,
        data: {
          total_pokemon: count,
          storage_date: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error("Error in PokemonController.getStats", err);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar estatísticas"
      });
    }
  }
}

module.exports = new PokemonController();