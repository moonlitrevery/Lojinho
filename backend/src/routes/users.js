const express = require("express");
const router = express.Router();
const db = require("../db/connection");

const UserController = require("../controllers/UserController");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};
router.use(timeLog);

router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.findById);
router.put("/users/:id", UserController.update);
router.post("/users/register", UserController.create);
router.delete("/users/:id", UserController.delete);
router.post("/users/login", UserController.login);

module.exports = router;
