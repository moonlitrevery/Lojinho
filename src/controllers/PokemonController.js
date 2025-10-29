const PokemonService = require("../services/PokemonService");

class PokemonController {
  async getAllPokemons(req, res) {
    try {
      const pokemon = await PokemonService.getAllPokemons();

      res.json({
        success: true,
        data: pokemon,
        count: pokemon.length,
      });
    } catch (err) {
      console.error("Error in PokemonController.getAllPokemons", err);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar pokemons",
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
}

module.exports = new PokemonController();
