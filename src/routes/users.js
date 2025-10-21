const express = require("express");
const router = express.Router();
const db = require('../db/connection');

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString('pt-BR'));
  next()
}
router.use(timeLog)

router.get("/users", async (req, res) => {
  try {
    const users = await db.query(
      `SELECT user_id, name, email, created_at
      FROM users
      ORDER BY created_at DESC`
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

module.exports = router
