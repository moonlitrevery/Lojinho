const db = require("../db/connection");

class UserModel {
  async create(userData) {
    const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;

    const [result] = await db.query(sql, [
      userData.username,
      userData.email,
      userData.password_hash,
    ]);

    return this.findById(result.insertId);
  }

  async findAll() {
    const [rows] = await db.query(
      `SELECT id, username, email, created_at
             FROM users
             ORDER BY created_at DESC
             `,
    );
    return rows;
  }

  async findById(userId) {
    const [rows] = await db.query(
      `SELECT id, username, email, created_at FROM users WHERE id = ?`,
      [userId],
    );
    return rows[0];
  }

  async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT id, username, email, password_hash FROM users WHERE email = ?`,
      [email],
    );
    return rows[0];
  }

  async update(userId, userData) {
    const updates = [];
    const values = [];

    // aceita tanto `username` quanto `name` como alias
    const username = userData.username ?? userData.name;

    if (username !== undefined) {
      updates.push("username = ?");
      values.push(username);
    }

    if (userData.email !== undefined) {
      updates.push("email = ?");
      values.push(userData.email);
    }

    if (userData.password_hash !== undefined) {
      updates.push("password_hash = ?");
      values.push(userData.password_hash);
    }

    if (updates.length === 0) {
      throw new Error("Nenhum campo fornecido para atualização");
    }

    values.push(userId);

    // IMPORTANTE: espaço depois da vírgula
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await db.query(sql, values);

    return this.findById(userId);
  }


  async delete(userId) {
    const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [userId]);
    return result.affectedRows > 0;
  }

  async userExists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }
}

module.exports = new UserModel();
