const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const db = require('./models'); // index는 생략가능해서 ./models/index.js 를 불러온다.
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');


dotenv.config();
const app = express();

db.sequelize.sync(); // 시퀄라이즈가 자동으로 테이블을 생성 해준다.


app.use(morgan('dev')); // 개발 모드 시 로그를 남겨준다.
// routes/*.js에 들어있는 req.body 이 부분을 처리하려면 아래 코드를 추가해야한다.
app.use(express.json()); // json 데이터 처리
app.use(express.urlencoded({ extended: true })); // form 데이터 처리
app.use(cors()); // CORS 문제 프론트,백엔드간의 서버 포트가 달라서 문제가 생기는 것을 해결해준다.
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키를 파싱해준다.
app.use(expressSession({ // 아래 두개의 옵션은 사용하지는 않지만 무조건 적어줘야하는 옵션이다. 보통은 false이다.
    resave: false, // 매번 세션에 강제 저장
    saveUninitialized: false, // 아무것도 없는 값도 저장
    secret: process.env.COOKIE_SECRET, // .env 파일에서 불러온다.
    cookie: {
        httpOnly: true, // 자바스크립트에서 접근을 못한다. 해커들이 쿠키 빼돌리는 코드를 심어서 해킹하는 것을 방지.
        secure: false, // https를 쓸 때 true
    }
})); // 세션을 사용하게 해준다.


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