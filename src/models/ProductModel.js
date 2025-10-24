const db = require("../db/connection");

class ProductModel {
    async create(productData) {
        const sql = `INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [
            productData.name,
            productData.description,
            productData.price,
            productData.stock,
            productData.category_id
        ]);

        return this.findById(result.insertId);
    }

    async findAll() {
        const [rows] = await db.query(
            `SELECT product_id, name, description, price, stock, category_id , created_at
             FROM products
             ORDER BY created_at DESC
             `);
             return rows;
    }

    async findById(productId) {
        const [rows] = await db.query(
            `SELECT product_id, name, description, price, stock, category_id,  created_at FROM products WHERE product_id = ?`,
            [productId]
        );
        return rows[0];
    }

    async update(productId, productData) {
        await db.query(
            `UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ? WHERE product_id = ?`,
            [productData.name, productData.description, productData.price, productData.stock, productData.category_id, productId]
        );
        return this.findById(productId);
    }

    async delete(productId) {
        const [result] = await db.query(
            `DELETE FROM products WHERE product_id = ?`,
            [productId]
        );
        return result.affectedRows > 0;
    }

}

module.exports = new ProductModel();
