const { validationResult, body, param } = require('express-validator');
const Joi = require('joi');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Dados de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

const userSchemas = {
  create: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  }),

  update: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const teamSchemas = {
  create: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    team_name: Joi.string().min(1).max(100).required(),
    pokemon_ids: Joi.array().items(Joi.number().integer().positive()).max(6).optional()
  })
};

const validateJoi = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Dados de entrada inválidos',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const userValidations = {
  create: [
    body('username')
      .isLength({ min: 3, max: 30 })
      .isAlphanumeric()
      .withMessage('Username deve ter entre 3 e 30 caracteres alfanuméricos'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email deve ser válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres'),
    handleValidationErrors
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email deve ser válido'),
    body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória'),
    handleValidationErrors
  ],

  update: [
    body('username')
      .optional()
      .isLength({ min: 3, max: 30 })
      .isAlphanumeric()
      .withMessage('Username deve ter entre 3 e 30 caracteres alfanuméricos'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Email deve ser válido'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres'),
    handleValidationErrors
  ]
};

const pokemonValidations = {
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID do Pokémon deve ser um número positivo'),
    handleValidationErrors
  ]
};

const teamValidations = {
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID do Time deve ser um número positivo'),
    handleValidationErrors
  ],

  addPokemon: [
    param('teamId')
      .isInt({ min: 1 })
      .withMessage('ID do Time deve ser um número positivo'),
    param('pokemonId')
      .isInt({ min: 1 })
      .withMessage('ID do Pokémon deve ser um número positivo'),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  validateJoi,
  userSchemas,
  teamSchemas,
  userValidations,
  pokemonValidations,
  teamValidations
};