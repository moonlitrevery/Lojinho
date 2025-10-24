const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString('pt-BR'));
  next()
}
router.use(timeLog)

router.get("/products", ProductController.findAll);
router.get("/products/:id", ProductController.findById);
router.post("/products", ProductController.create);
router.put("/products/:id", ProductController.update);
router.delete("/products/:id", ProductController.delete);

module.exports = router