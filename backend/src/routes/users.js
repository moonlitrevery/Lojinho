const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const {
  userValidations,
  validateJoi,
  userSchemas
} = require("../middleware/validation");

const timeLog = (req, res, next) => {
  console.log("Date: ", new Date().toLocaleString("pt-BR"));
  next();
};

router.use(timeLog);

router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.findById);
router.put("/users/:id", userValidations.update, UserController.update);
router.post("/users/register", userValidations.create, validateJoi(userSchemas.create), UserController.create);
router.delete("/users/:id", UserController.delete);
router.post("/users/login", userValidations.login, validateJoi(userSchemas.login), UserController.login);

module.exports = router;