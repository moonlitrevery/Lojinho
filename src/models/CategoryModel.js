const db = require("../db/connection");

class CategoryModel {
    async create(categoryData) {
        const sql = `INSERT INTO categories (category_name, description) VALUES (?, ?)`;

        const [result] = await db.query(sql, [
            categoryData.category_name,
            categoryData.description
        ]);

        return this.findById(result.insertId);
    }

    async findAll() {
        const [rows] = await db.query(
            `SELECT category_id, category_name, description
             FROM categories
             ORDER BY category_name`
        );
        return rows;
    }

    async findById(categoryId) {
        const [rows] = await db.query(
            `SELECT category_id, category_name, description FROM categories WHERE category_id = ?`,
            [categoryId]
        );
        return rows[0];
    }

    async update(categoryId, categoryData) {
        await db.query(
            `UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?`,
            [
                categoryData.category_name,
                categoryData.description,
                categoryId
            ]
        );
        return this.findById(categoryId);
    }

    async delete(categoryId) {
        const [result] = await db.query(
            `DELETE FROM categories WHERE category_id = ?`,
            [categoryId]
        );
        return result.affectedRows > 0;
    }

    async categoryExists(categoryName) {
        const [rows] = await db.query(
            `SELECT category_id FROM categories WHERE category_name = ?`,
            [categoryName]
        );
        return rows.length > 0;
    }
}

module.exports = new CategoryModel();