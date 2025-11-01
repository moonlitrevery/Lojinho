const db = require("../db/connection");

class PokemonModel {
  async create(pokemonData) {
    const sql = `INSERT INTO pokemon 
      (id, name, height, weight, base_experience, types, abilities, 
       sprite_front_default, sprite_front_shiny, sprite_official_artwork, stats) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const [result] = await db.query(sql, [
      pokemonData.id,
      pokemonData.name,
      pokemonData.height,
      pokemonData.weight,
      pokemonData.base_experience,
      JSON.stringify(pokemonData.types),
      JSON.stringify(pokemonData.abilities),
      pokemonData.sprite,
      pokemonData.sprite_front_shiny,
      pokemonData.official_artwork,
      JSON.stringify(pokemonData.stats)
    ]);
    return result.insertId;
  }

  async findById(pokemonId) {
    const [rows] = await db.query(
      `SELECT * FROM pokemon WHERE id = ?`,
      [pokemonId]
    );
    return rows[0];
  }

  async findAll(limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT * FROM pokemon ORDER BY id LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    return rows;
  }

  async searchByName(name) {
    const [rows] = await db.query(
      `SELECT * FROM pokemon WHERE name LIKE ?`,
      [`%${name}%`]
    );
    return rows;
  }

  async getCount() {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM pokemon`);
    return rows[0].count;
  }
}

module.exports = new PokemonModel();