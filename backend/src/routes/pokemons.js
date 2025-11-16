const express = require("express");
const router = express.Router();
const PokemonController = require("../controllers/PokemonController");

const {
  pokemonValidations
} = require("../middleware/validation");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};

router.use(timeLog);

router.get("/pokemon", PokemonController.getAllPokemons);
router.get("/pokemon/search", PokemonController.searchPokemon);
router.get("/pokemon/stats", PokemonController.getStats);
router.get("/pokemon/:id", pokemonValidations.getById, PokemonController.getPokemonId);

module.exports = router;