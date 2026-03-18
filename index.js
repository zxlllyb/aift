ssl: {
    rejectUnauthorized: false // Neon 접속 시 SSL 설정 필요
  }
});

client.connect()
  .then(() => console.log('DB 연결 성공!'))
  .catch(err => console.error('DB 연결 에러:', err));

app.get('/', async (req, res) => {
  try {
    // name 컬럼만 조회하는 쿼리
    const result = await client.query('SELECT name FROM test LIMIT 1');
    
    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`hello ${name}`);
    } else {
      res.send('데이터가 없습니다.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 에러가 발생했습니다.');
  }
});
