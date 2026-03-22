const express = require('express');
const { Client } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
client.connect().catch(err => console.error('DB 연결 실패:', err));

// 메인 화면으로 접속하면 index.html을 보여줌
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// DB에서 이름을 가져오는 통로
app.get('/api/user', async (req, res) => {
  try {
    const result = await client.query('SELECT name FROM test LIMIT 1');
    res.json({ name: result.rows[0].name });
  } catch (err) {
    res.json({ name: "방문자" });
  }
});

app.listen(port, () => {
  console.log(`Server is running!`);
});
