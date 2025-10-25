const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString('pt-BR'));
  next()
}
router.use(timeLog)

router.get("/categories", CategoryController.findAll);
router.get("/categories/:id", CategoryController.findById);
router.post("/categories", CategoryController.create);
router.put("/categories/:id", CategoryController.update);
router.delete("/categories/:id", CategoryController.delete);

module.exports = router