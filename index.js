const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// 데이터 저장 API
app.post('/start', async (req, res) => {
  const log = await prisma.studyLog.create({ data: { subject: req.body.subject } });
  res.json(log);
});

app.listen(3000, () => console.log('Server is running!'));
