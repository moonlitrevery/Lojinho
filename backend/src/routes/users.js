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
router.post("/users", UserController.create);

module.exports = router;
