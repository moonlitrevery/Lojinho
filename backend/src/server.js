const app = require("./app");
const connection = require("./db/connection");

// Use environment variable with fallback
const PORT = process.env.PORT || 3067;

app.listen(PORT, "0.0.0.0", async () => {
  // ← Added '0.0.0.0' for Docker
  console.log(`API Lojinho está sendo executado na porta ${PORT}`);

  try {
    const [result] = await connection.execute("SELECT 1");
    if (result) {
      console.log("MySQL connection OK");
    }
  } catch (error) {
    console.error("MySQL connection failed: ", error.message);
  }
});
