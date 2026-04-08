const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();

// JSON 파싱 및 정적 파일 제공 설정
app.use(express.json());
app.use(express.static('public'));

// Neon PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false // Render 환경에서 연결 오류를 방지하는 필수 설정
  }
});

/** * 1. 기록 저장 API 
 * 타이머 종료 시 과목과 시간을 DB에 저장합니다.
 */
app.post('/api/save', async (req, res) => {
  const { duration, subject } = req.body;
  try {
    const query = 'INSERT INTO study_logs (duration_seconds, subject) VALUES ($1, $2)';
    await pool.query(query, [duration, subject || '일반']);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '데이터 저장 중 오류가 발생했습니다.' });
  }
});

/** * 2. 차트용 데이터 API 
 * 과목별로 공부 시간의 합계를 계산해 보냅니다.
 */
app.get('/api/chart-data', async (req, res) => {
  try {
    const query = `
      SELECT subject, SUM(duration_seconds) as total_seconds 
      FROM study_logs 
      GROUP BY subject
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '데이터를 불러오는 데 실패했습니다.' });
  }
});

/** * 3. 전체 히스토리 API 
 * 최근 공부 기록 10개를 가져옵니다.
 */
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM study_logs ORDER BY id DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '히스토리를 불러오는 데 실패했습니다.' });
  }
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`압도적인 준성님의 타이머 서버가 가동되었습니다.`);
});
