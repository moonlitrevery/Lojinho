const db = require("../db/connection");

class TeamModel {
  async createTeam(userData) {
    const sql = `INSERT INTO user_teams (user_id, team_name, pokemon_ids) VALUES (?, ?, ?)`;

    const [result] = await db.query(sql, [
      userData.user_id,
      userData.team_name,
      userData.pokemon_ids,
    ]);

    return this.findTeamById(result.insertId);
  }

  async findTeamById(userId) {
    const [rows] = await db.query(
      `SELECT id, user_id, team_name, pokemon_ids, is_active, created_at FROM user_teams WHERE id = ?`,
      [userId],
    );
    return rows[0];
  }
}

module.exports = new TeamModel();
