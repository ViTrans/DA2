const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'doan2',
});
conn.on('connected', function () {});
conn.on('disconnected', function () {});
conn.on('error', function (error) {});

process.on('SIGINT', async function () {
  await conn.close();
  process.exit(0);
});

module.exports = conn;
