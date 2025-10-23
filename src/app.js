const express = require('express');
const usersRoute = require("./routes/users");
const productsRoute = require("./routes/products");

const app = express();
app.use(express.json());

app.get("/", (req,res) => {
  res.send("Hello, World!");
})
app.post("/", (req,res) => {
  res.send("got POST request");
})

// Rotas
// a rota está "vazia" aqui pq ela está setada no proprio arquivo, a rota está corretamente como /users no users.js
app.use("/", usersRoute);
app.use("/", productsRoute);

module.exports = app;
