const express = require("express");
const usersRoute = require("./routes/users");
const pokemonsRoute = require("./routes/pokemons");
const TeamsRoute = require("./routes/teams");

const {
  helmetConfig,
  corsMiddleware,
  sanitizeInput,
  preventParameterPollution,
  securityLogger
} = require("./middleware/security");

const {
  authLimiter,
  apiLimiter,
  createLimiter
} = require("./middleware/rateLimit");

const app = express();

app.use(helmetConfig);
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' })); // Limitar tamanho do payload
app.use(sanitizeInput);
app.use(preventParameterPollution);
app.use(securityLogger);

app.use('/users/login', authLimiter);
app.use('/users/register', authLimiter);
app.use('/teams/create', createLimiter);
app.use('/pokemon', apiLimiter);
app.use('/users', apiLimiter);
app.use('/teams', apiLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rotas
// a rota está "vazia" aqui pq ela está setada no proprio arquivo, a rota está corretamente como /users no users.js
app.use("/", usersRoute);
app.use("/", pokemonsRoute);
app.use("/", TeamsRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

module.exports = app;