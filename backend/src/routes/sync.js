const express = require("express");
const router = express.Router();
const SyncController = require("../controllers/SyncController");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};
router.use(timeLog);

// Sincronizar Pokémon específico
router.post("/sync/pokemon/:id", SyncController.syncPokemonById);

// Sincronizar múltiplos Pokémon
router.post("/sync/pokemon/batch", SyncController.syncPokemonByIds);

// Sincronizar por intervalo
router.post("/sync/pokemon/range", SyncController.syncPokemonByRange);

// Sincronizar da lista da API
router.get("/sync/pokemon/list", SyncController.syncPokemonFromList);

module.exports = router;