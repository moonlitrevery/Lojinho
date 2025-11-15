// __tests__/TeamModel.test.js
jest.mock("../../db/connection", () => ({
  query: jest.fn(),
}));

const db = require("../../db/connection");
const TeamModel = require("../../models/TeamModel");

describe("TeamModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createTeam deve inserir e depois buscar por ID gerado", async () => {
    // 1ª query (INSERT) retorna insertId
    db.query
      .mockResolvedValueOnce([{ insertId: 42 }])
      // 2ª query (SELECT by id) retorna a linha criada
      .mockResolvedValueOnce([[{ id: 42, user_id: 1, team_name: "Time A", pokemon_ids: "1,2,3" }]]);

    const created = await TeamModel.createTeam({
      user_id: 1,
      team_name: "Time A",
      pokemon_ids: "1,2,3",
    });

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("INSERT INTO user_teams"),
      expect.arrayContaining([1, "Time A"])
    );


    expect(db.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("FROM user_teams WHERE id = ?"),
      [42]
    );

    expect(created).toEqual({ id: 42, user_id: 1, team_name: "Time A", pokemon_ids: "1,2,3" });
  });

  it("findTeamById deve montar SELECT corretamente", async () => {
    db.query.mockResolvedValueOnce([[{ id: 7 }]]);
    const row = await TeamModel.findTeamById(7);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("FROM user_teams WHERE id = ?"),
      [7]
    );
    expect(row).toEqual({ id: 7 });
  });
});
