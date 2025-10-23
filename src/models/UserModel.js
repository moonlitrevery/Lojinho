const db = require("../db/connection");

class UserModel {
    async create(userData) {
        const sql = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;

        const [result] = await db.query(sql, [
            userData.name,
            userData.email,
            userData.password_hash
        ]);

        return this.findById(result.insertId);
    }

    async findAll() {
        const [rows] = await db.query(
            `SELECT user_id, name, email, created_at
             FROM users
             ORDER BY created_at DESC
             `);
             return rows;
    }

    async findById(userId) {
        const [rows] = await db.query(
            `SELECT user_id, name, email, created_at FROM users WHERE user_id = ?`,
            [userId]
        );
        return rows[0];
    }

    async findByEmail(email) {
        const [rows] = await db.query(
            `SELECT user_id, name, email, password_hash FROM users WHERE email = ?`,
            [email]
        );
        return rows[0];
    }

    async update(userId, userData) {
        await db.query(
            `UPDATE users SET name = ?, email = ? WHERE user_id = ?`,
            [userData.name, userData.email, userId]
        );
        return this.findById(userId);
    }

    async delete(userId) {
        const [result] = await db.query(
            `DELETE FROM users WHERE user_id = ?`,
            [userId]
        );
        return result.affectedRows > 0;
    }

    async userExists(email) {
        const user = await this.findByEmail(email);
        return !!user;
    }
}

module.exports = new UserModel();
