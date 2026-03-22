const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('DB 연결 성공'))
  .catch(err => console.error('DB 연결 에러:', err));

app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT name FROM test LIMIT 1');
    if (result.rows.length > 0) {
      res.send(`hello ${result.rows[0].name}`);
    } else {
      res.send('데이터가 없습니다.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 에러');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
