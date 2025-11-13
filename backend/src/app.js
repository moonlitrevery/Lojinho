const express = require("express");
const usersRoute = require("./routes/users");
const pokemonsRoute = require("./routes/pokemons");
const TeamsRoute = require("./routes/teams");
const syncRoute = require("./routes/sync");

const app = express();
app.use(express.json());

// Rotas
// a rota está "vazia" aqui pq ela está setada no proprio arquivo, a rota está corretamente como /users no users.js
app.use("/", usersRoute);
app.use("/", pokemonsRoute);
app.use("/", TeamsRoute);
app.use("/", syncRoute);

module.exports = app;
