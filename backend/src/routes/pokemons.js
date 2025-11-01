const express = require("express");
const router = express.Router();
const PokemonController = require("../controllers/PokemonController");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};
router.use(timeLog);

// GET /pokemon - Listar todos os Pokémon (com paginação)
router.get("/pokemon", PokemonController.getAllPokemons);

// GET /pokemon/search - Buscar Pokémon por nome
router.get("/pokemon/search", PokemonController.searchPokemon);

// GET /pokemon/stats - Estatísticas do banco
router.get("/pokemon/stats", PokemonController.getStats);

// GET /pokemon/:id - Buscar Pokémon por ID
router.get("/pokemon/:id", PokemonController.getPokemonId);

module.exports = router;