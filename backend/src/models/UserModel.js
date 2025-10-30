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
    await db.query(`UPDATE users SET username = ?, email = ? WHERE id = ?`, [
      userData.name,
      userData.email,
      userId,
    ]);
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
