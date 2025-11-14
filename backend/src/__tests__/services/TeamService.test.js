// src/__tests__/services/TeamService.test.js
jest.mock("../../models/TeamModel", () => ({
  createTeam: jest.fn(),
  findTeamById: jest.fn(),
}));

const TeamModel = require("../../models/TeamModel");
const TeamService = require("../../services/TeamService");

describe("TeamService", () => {
  afterEach(() => jest.clearAllMocks());

  test("createTeam delega ao model e retorna o resultado", async () => {
    const created = { id: 1, user_id: 9, team_name: "Time A", pokemon_ids: "1,2,3" };
    TeamModel.createTeam.mockResolvedValueOnce(created);

    const payload = { user_id: 9, team_name: "Time A", pokemon_ids: "1,2,3" };

    const res = await TeamService.createTeam(payload);

    expect(TeamModel.createTeam).toHaveBeenCalledWith(payload);
    expect(res).toBe(created);
  });


  test("findTeamById lança erro quando não encontrar", async () => {
    TeamModel.findTeamById.mockResolvedValueOnce(null);
    await expect(TeamService.findTeamById(99)).rejects.toThrow("Time não encontrado");
  });

  test("findTeamById retorna o time quando encontrar (comportamento desejado)", async () => {
    const team = { id: 2, user_id: 7 };
    TeamModel.findTeamById.mockResolvedValueOnce(team);

    // A IMPLEMENTAÇÃO ATUAL NÃO DÁ `return` — este teste vai falhar até você corrigir:
    //   async findTeamById(userId) {
    //     const team = await TeamModel.findTeamById(userId);
    //     if (!team) throw new Error("Time não encontrado");
    //     return team;  // <--- adicionar
    //   }
    await expect(TeamService.findTeamById(2)).resolves.toEqual(team);


  });
});
