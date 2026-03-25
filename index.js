const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // 다른 도메인에서도 접속 가능하게 허용

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // index.html 파일을 서버에서 바로 보여주기 위함

// [기능 1] 공부 기록 저장하기 (DB에 쓰기)
app.post('/api/study/save', async (req, res) => {
  const { subject, duration } = req.body;
  try {
    const log = await prisma.studyLog.create({
      data: {
        subject: subject || "자율학습",
        duration: parseInt(duration), // 초 단위 저장
        endTime: new Date()
      }
    });
    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [기능 2] 공부 기록 불러오기 (DB에서 가져오기)
app.get('/api/study/logs', async (req, res) => {
  const logs = await prisma.studyLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10 // 최근 10개만
  });
  res.json(logs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
