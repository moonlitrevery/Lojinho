const TeamModel = require("../models/TeamModel");

class TeamService {
  async createTeam() {
    return await TeamModel.createTeam();
  }

  async findTeamById(userId) {
    const team = await TeamModel.findTeamById(userId);
    if (!team) {
      throw new Error("Time não encontrado");
    }
  }
}

module.exports = new TeamService();
