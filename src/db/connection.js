const mysql = require("mysql2");

const connection = mysql
  .createPool({
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT || 3069,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root",
    database: process.env.DB_NAME || "poke_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

module.exports = connection;
