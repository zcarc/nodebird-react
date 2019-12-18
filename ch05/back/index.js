const express = require('express');
const db = require('./models'); // index는 생략가능해서 ./models/index.js 를 불러온다.
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

const app = express();

db.sequelize.sync(); // 시퀄라이즈가 자동으로 테이블을 생성 해준다.


// get() 의 첫번째 인자는 localhost:8080 뒤에 붙는 주소인데,
// 프론트에서 백엔드로 '/' 으로 요청을 보내면
// 두번째 인자인 콜백함수는 req, res 매개변수를 받고 res 객체로 응답을 보내준다.

// API: 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열여둔 창구

// app.use()의 첫번째 인자인 '/api/user' 주소가 기본 주소이고
// 이 뒤에 붙는 주소는 userAPIRouter에 설정되어 있는 주소로 찾아간다.
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);







// app.get(), app.post()
// 첫번째 인자, '/api/post/images' : "라우터"라고 부른다.
// 두번째 인자, (req, res) => {} : "컨트롤러"라고 부른다.

// 파일이 실행되면 서버가 실행되는데
// 실제 서버가 아니라 localhost 서버의 8080 포트번호의 서버
app.listen(8080, () => {
    console.log('server is running on http://localhost:8080');
});