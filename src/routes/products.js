const express = require("express");
const router = express.Router();

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString('pt-BR'));
  next()
}
router.use(timeLog)

router.get("/products", (req, res) => {
  res.send("Page products");
});

module.exports = router
