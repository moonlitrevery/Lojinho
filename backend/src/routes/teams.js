const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/TeamController");

const {
  teamValidations,
  validateJoi,
  teamSchemas
} = require("../middleware/validation");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};

router.use(timeLog);

router.get("/teams", TeamController.findAllTeams);
router.get("/teams/:id", teamValidations.getById, TeamController.findTeamById);
router.post("/teams/create", validateJoi(teamSchemas.create), TeamController.createTeam);
router.delete("/teams/:id", teamValidations.getById, TeamController.deleteTeam);
router.post("/teams/:teamId/pokemon/:pokemonId", teamValidations.addPokemon, TeamController.addPokemonToTeam);
router.delete("/teams/:teamId/pokemon/:pokemonId", teamValidations.addPokemon, TeamController.removePokemonFromTeam);
router.delete("/teams/:teamId/pokemon", teamValidations.getById, TeamController.clearTeam);

module.exports = router;