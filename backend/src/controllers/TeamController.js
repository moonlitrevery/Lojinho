const TeamService = require("../services/TeamService");

class TeamController {
    async createTeam(req, res) {
        try {
            const team = await TeamService.createTeam(req.body);

            res.status(201).json({
                success: true,
                data: team,
                message: "Time criado com sucesso",
            });
        } catch (err) {
            console.error("Error in TeamController.createTeam", err);

            return res.status(400).json({
                success: false,
                error: err.message,
            });
        }
    }

    async findTeamById(req, res) {
        try {
            const team = await TeamService.findTeamById(req.params.id);

            res.json({
                success: true,
                data: team,
            });
        } catch (err) {
            if (err.message === "Time não encontrado") {
                return res.status(404).json({
                    success: false,
                    error: err.message,
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao buscar time",
            });
        }
    }

    async findAllTeams(req, res) {
        try {
            const teams = await TeamService.findAllTeams();
            
            res.json({
                success: true,
                data: teams,
                count: teams.length,
            });
        } catch (err) {
            console.error("Error in TeamController.findAllTeams", err);
            res.status(500).json({
                success: false,
                error: "Erro ao buscar times",
            });
        }
    }

    async deleteTeam(req, res) {
        try {
            const result = await TeamService.deleteTeam(req.params.id);

            res.json({
                success: true,
                data: result.message,
            });
        } catch (err) {
            if (err.message === "Falha ao excluir time") {
                return res.status(404).json({
                    success: false,
                    error: err.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao excluir usuário",
            });
        }
    }

    async addPokemonToTeam(req, res) {
        try {
            const { teamId, pokemonId } = req.params;

            const team = await TeamService.addPokemonToTeam(teamId, pokemonId);

            res.json({
                success: true,
                data: team,
                message: "Pokémon adicionado ao time com sucesso",
            });
        } catch (err) {
            console.error("Error in the TeamController.addPokemonToTeam", err);

            const status = err.message.includes("não encontrado") ? 404 : 400;
            return res.status(status).json({
                success: false,
                error: err.message,
            });
        }
    }

    async removePokemonFromTeam(req, res) {
        try {
            const { teamId, pokemonId } = req.params;

            const team = await TeamService.removePokemonFromTeam(teamId, pokemonId);

            res.json({
                success: true,
                data: team,
                message: "Pokémon removido do time com sucesso",
            });
        } catch (err) {
            console.error("Error in TeamController.removePokemonFromTeam", err);
      
            const status = err.message.includes("não encontrado") ? 404 : 400;
            return res.status(status).json({
                success: false,
                error: err.message,
            });
        }
    }

    async clearTeam(req, res) {
        try {
            const { teamId } = req.params;

            const team = await TeamService.clearTeam(teamId);

            res.json({
                success: true,
                data: team,
                message: "Time limpo com sucesso",
            });
        } catch (err) {
            console.error("Error in TeamController.clearTeam", err);
      
            const status = err.message.includes("não encontrado") ? 404 : 400;
            return res.status(status).json({
                success: false,
                error: err.message,
            });
        }
    }
}

module.exports = new TeamController();