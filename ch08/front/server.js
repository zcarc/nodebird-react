const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const app = next({dev}); // dev: true
const handle = app.getRequestHandler();
dotenv.config();

// next와 express를 연결
// 해쉬태그 주소 뒤에 좋아요나 구독처럼 주소를 동적으로 사용하려고 사용
// 이렇게 해야 그 주소처럼 검색을 할 수 있다.
app.prepare().then(() => {
    const server = express();

    server.use(morgan('dev'));
    server.use('/', express.static(path.join(__dirname, 'public')));
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));
    server.use(cookieParser(process.env.COOKIE_SECRET)); // dotdev에서 넣어준다.
    server.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    }));

    server.get('/post/:id', (req, res) => {

        console.log(`### front/server.js '/post/:id'... ###`);

        return app.render(req, res, '/post', { id: req.params.id });
    });

    server.get('/hashtag/:tag', (req, res) => {

        console.log(`### front/server.js '/hashtag/:tag'... ###`);

        // 3번째 인자: 화면상에 뿌려질 화면은 pages/hashtag.jsx hashtag 페이지가 동적인 주소를 붙일 수 없어서 이렇게 연결해준다.
        // 4번째 인자: hashtag.jsx에 queryString 값을 넘겨준다.
        return app.render(req, res, '/hashtag', { tag: req.params.tag });
    });

    server.get('/user/:id', (req, res) => {
        return app.render(req, res, '/user', { id: req.params.id });
    });

    server.get('*', (req, res) => {

        return handle(req, res);
    });

    server.listen(3000, () => {
        console.log('next+express running on port 3000');
    });
});