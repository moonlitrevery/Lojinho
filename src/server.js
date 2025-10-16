const app = require('./app');
const connection = require('./db/connection');
const connect = require('./db/connection');

const PORT = 3001;

app.listen(PORT, async () => {
  console.log(`API Lojinho está sendo executado na porta ${PORT}`);

  const [result] = await connection.execute('SELECT 1');
  if (result) {
    console.log('MySQL connection OK');
  }
});
