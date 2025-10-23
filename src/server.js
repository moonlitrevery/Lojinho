const app = require("./app");
const connection = require("./db/connection");
const PORT = 3001;

app.listen(PORT, async () => {
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
