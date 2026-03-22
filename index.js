const express = require('express');
const { Client } = require('pg');
const path = require('path');

const app = express();
app.use(express.json()); // 중요: 가입/로그인 등 데이터를 주고받을 때 필요함
const port = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
client.connect();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. 유저 정보 가져오기
app.get('/api/user', async (req, res) => {
  const result = await client.query('SELECT name FROM test LIMIT 1');
  res.json({ name: result.rows[0].name });
});

// 2. 공부 시간 저장하기 (추가된 부분!)
app.post('/api/save-session', async (req, res) => {
  const { name, duration } = req.body;
  try {
    await client.query(
      'INSERT INTO study_sessions (user_name, duration_seconds) VALUES ($1, $2)',
      [name, duration]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "저장 실패" });
  }
});

app.listen(port, () => console.log(`Server running!`));
