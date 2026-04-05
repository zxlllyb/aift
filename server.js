const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // public 폴더 안의 html을 보여줌

// Neon 연동 (Render 설정의 DATABASE_URL 환경변수 사용)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }
});

// 기록 저장 API
app.post('/api/save', async (req, res) => {
  const { duration } = req.body;
  try {
    await pool.query('INSERT INTO study_logs (duration_seconds) VALUES ($1)', [duration]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 기록 불러오기 API
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM study_logs ORDER BY id DESC LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
