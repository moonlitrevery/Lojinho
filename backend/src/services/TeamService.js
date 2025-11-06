const TeamModel = require("../models/TeamModel");
const PokeAPI = require("../services/PokeApiService");

class TeamService {
  async createTeam(userData) {
    if (!userData || !userData.user_id || !userData.team_name) {
      throw new Error("Dados incompletos para criar time");
    }

    const team = await TeamModel.createTeam(userData);
    return team;
  }

  async findTeamById(teamId) {
    const team = await TeamModel.findTeamById(teamId);
    if (!team) {
      throw new Error("Time não encontrado");
    }
    return team;
  }

  async findAllTeams() {
    const teams = await TeamModel.findAllTeams();
    if (!teams) {
      throw new Error("Times não encontrados");
    }
    return teams;
  }

  async deleteTeam(teamId) {
    const teamExists = await TeamModel.findTeamById(teamId);
    if (!teamExists) {
      throw new Error("Time não encontrado");
    }

    const result = await TeamModel.deleteTeam(teamId);
    
    if (result.affectedRows === 0) {
      throw new Error("Falha ao excluir time");
    }

    return { message: "Time excluído com sucesso" };
  }

  async addPokemonToTeam(teamId, pokemonId) {
    if (!pokemonId || isNaN(pokemonId)) {
      throw new Error("ID do pokémon inválido");
    }

    const pokemonIdInt = parseInt(pokemonId);

    try {
      await PokeAPI.getPokemonId(pokemonIdInt);
    } catch (error) {
      throw new Error(`Pokémon com ID ${pokemonIdInt} não existe na PokeAPI`);
    }

    const team = await TeamModel.findTeamById(teamId);
    if (!team) {
      throw new Error("Time não encontrado");
    }

    const pokemonIds = team.pokemon_ids || [];
    if (pokemonIds.length >= 6) {
      throw new Error("Time já está completo (máximo 6 pokémon)");
    }

    if (pokemonIds.includes(pokemonIdInt)) {
      throw new Error("Pokémon já está no time");
    }

    const updatedTeam = await TeamModel.addPokemonToTeam(teamId, pokemonIdInt);
    return updatedTeam;
  }

  async removePokemonFromTeam(teamId, pokemonId) {
    if (!pokemonId || isNaN(pokemonId)) {
      throw new Error("ID do pokémon inválido");
    }

    const team = await TeamModel.removePokemonFromTeam(teamId, parseInt(pokemonId));
    return team;
  }

  async clearTeam(teamId) {
    const team = await TeamModel.clearTeam(teamId);
    return team;
  }
}

module.exports = new TeamService();