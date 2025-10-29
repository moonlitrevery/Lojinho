const express = require("express");
const router = express.Router();
const PokemonController = require("../controllers/PokemonController");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};
router.use(timeLog);

router.get("/pokemon", PokemonController.getAllPokemons);
router.get("/pokemon/:id", PokemonController.getPokemonId);

module.exports = router;
