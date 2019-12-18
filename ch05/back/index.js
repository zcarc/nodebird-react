const express = require('express');

const db = require('./models'); // index는 생략가능해서 ./models/index.js 를 불러온다.

const app = express();

db.sequelize.sync(); // 알아서 테이블 생성을 해준다.

// get() 의 첫번째 인자는 localhost:8080 뒤에 붙는 주소인데,
// 프론트에서 백엔드로 '/' 으로 요청을 보내면
// 두번째 인자인 콜백함수는 req, res 매개변수를 받고 res 객체로 응답을 보내준다.
app.get('/', (req, res) => {
   res.send('Hello, server');
});

app.get('/about', (req, res) => {
   res.send('Hello, about');
});

// 파일이 실행되면 서버가 실행되는데
// 실제 서버가 아니라 localhost 서버의 8080 포트번호의 서버
app.listen(8080, () => {
    console.log('server is running on http://localhost:8080');
});