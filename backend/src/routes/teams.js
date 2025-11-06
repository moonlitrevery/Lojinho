const express = require("express");
const router = express.Router();
const db = require("../db/connection");

const TeamController = require("../controllers/TeamController");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};
router.use(timeLog);

router.get("/teams", TeamController.findAllTeams);
router.get("/teams/:id", TeamController.findTeamById);
router.post("/teams/create", TeamController.createTeam);
router.delete("/teams/:id", TeamController.deleteTeam);
router.post("/teams/:teamId/pokemon/:pokemonId", TeamController.addPokemonToTeam);
router.delete("/teams/:teamId/pokemon/:pokemonId", TeamController.removePokemonFromTeam);
router.delete("/teams/:teamId/pokemon", TeamController.clearTeam); 

module.exports = router;
