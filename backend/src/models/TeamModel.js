const db = require("../db/connection");

class TeamModel {
  async createTeam(userData) {
    const sql = `INSERT INTO user_teams (user_id, team_name) VALUES (?, ?)`;

    const [result] = await db.query(sql, [
      userData.user_id,
      userData.team_name,
      JSON.stringify([]),
    ]);

    return this.findTeamById(result.insertId);
  }

  async findTeamById(teamId) {
    const [rows] = await db.query(
      `SELECT id, user_id, team_name, pokemon_ids, is_active, created_at FROM user_teams WHERE id = ?`,
      [teamId],
    );
    return rows[0];
  }

  async findAllTeams() {
    const [rows] = await db.query(
      `SELECT id, user_id, team_name, pokemon_ids, is_active, created_at FROM user_teams ORDER BY created_at`,
    );
    return rows;
  }

  async deleteTeam(teamId) {
    const [result] = await db.query(
      `DELETE FROM user_teams WHERE id = ?`,
      [teamId]
    );
    return result;
  }

  async addPokemonToTeam(teamId, pokemonId) {
    const team = await this.findTeamById(teamId);
    if (!team) {
      throw new Error("Time não encontrado");
    }
  
    if (!team.pokemon_ids || !Array.isArray(team.pokemon_ids)) {
      team.pokemon_ids = [];
    }

    if (team.pokemon_ids.length >= 6) {
      throw new Error("Time já está completo (máximo 6 pokémon)");
    }

    if (team.pokemon_ids.includes(pokemonId)) {
      throw new Error("Pokémon já está no time");
    }

  const updatedPokemonIds = [...team.pokemon_ids, pokemonId];

  const [result] = await db.query(
    `UPDATE user_teams SET pokemon_ids = ? WHERE id = ?`,
    [JSON.stringify(updatedPokemonIds), teamId]
  );

    return this.findTeamById(teamId);
  }

  async removePokemonFromTeam(teamId, pokemonId) {
    const team = await this.findTeamById(teamId);
    if (!team) {
      throw new Error("Time não encontrado");
    }

    const updatedPokemonIds = team.pokemon_ids.filter(id => id !== pokemonId);

    const [result] = await db.query(
      `UPDATE user_teams SET pokemon_ids = ? WHERE id = ?`,
      [JSON.stringify(updatedPokemonIds), teamId]
    );

    return this.findTeamById(teamId);
  }

  async clearTeam(teamId, pokemonId) {
    const [result] = await db.query(
      `UPDATE user_teams SET pokemon_ids = ? WHERE id = ?`,
      [JSON.stringify([]), teamId]
    );

    return this.findTeamById(teamId);
  }
}

module.exports = new TeamModel();
