const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models'); // index에 db.User()로 연결되어 있기 때문에 불러오면 어디서든 쓸 수 있다.

const router = express.Router();

// 내 정보 조회
router.get('/', (req, res) => { //   /api/user/
});

// 회원가입
router.post('/', async (req, res, next) => {

    try { // 회원가입 시 에러가 발생할 수 있으므로 감싸준다.

        // < 회원가입 하려는 사용자가 기존에 있는지 조회 >
        const exUser = await db.User.findOne({ // findOne({}) 하나만 찾을 때 사용한다.
           where: { // where에 조건을 적어주면 된다.
               userId: req.body.userId,
           },
        });

        if(exUser) {
            // 에러를 응답으로 보내려면 res.state(400~599)
            // 404: 페이지가 없다.
            // 403: 접근이 금지되어 있다.
            // 401: 권한이 없다.
            // 보통은 403이 무난하다.
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }

        // < 사용자가 검색되지 않았을 경우 사용자 생성 >

        // bcrypt 모듈로 패스워드 암호화
        // salt : 값이 높을수록 해킹하기 힘들어지지만 문제는 높을수록 비밀번호 만드는 시간도 오래걸린다.
        // 보통은 10 ~ 13으로 많이한다.
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await db.User.create({
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        });

        console.log(`newUser: ${newUser}`);
        return res.status(200).json(newUser); // 여기서 status(200)을 생략해도 기본값 (200 or 304)으로 설정되어 있다.

    } catch (e) {
        console.error(e);

        // 에러처리
        return next(e); // 알아서 프론트쪽으로 에러를 넘겨준다.
    }
});

// 다른 사람 정보 조회
// ex) /api/user/3
// :id는 req.params.id로 가져올 수 있다.
router.get('/:id', (req, res) => {

});

// 로그아웃
router.post('/logout', (req, res) => {  //   /api/user/logout
});

// 로그인
router.post('/login', (req, res, next) => { // POST /api/user/login

    // (err, user, info) : done() 메서드의 첫번째 인자 err, 두번째 인자 user, 세번째 인자 info
    passport.authenticate('local', (err, user, info) => {

        // 서버 에러가 있을 시
        if(err) {
            console.error(err);
            return next(err); // express가 알아서 서버로 에러를 보내준다.
        }

        // 로직 상의 에러가 있을 시
        if(info) {
            return res.status(401).send(info.reason); //send() : 문자열로 이유를 보낸다.
        }

        // 로그인 성공 시 서버에 쿠키와 세션이 저장된다.
        return req.login(user, (loginErr) => {

            // 로그인하면서 에러가 발생 시 *이런 경우는 아주아주 드물지만 혹시나 해서 해준다.
            if (loginErr) {
                return next(loginErr);
            }

            // 패스워드가 담겨 있으니 얕은 복사를 한 후에
            // 패스워드를 삭제하고 프론트에 보내준다.
            const filteredUser = Object.assign({}, user);
            delete filteredUser.password;

            // 프론트에 사용자 정보를 JSON 형태로 보내준다.
            return res.json(filteredUser);
        });
    })(req, res, next);
});

// 특정 유저의 팔로워 목록 가져오기
router.get('/:id/follow', (req, res) => {   //   /api/user/:id/follow
});

// 특정 유저의 팔로우 하기
router.post('/:id/follow', (req, res) => {
});

// 특정 유저 팔로우 취소하기
router.delete('/:id/follow', (req, res) => {
});

// 특정 유저 팔로우 삭제하기
router.delete('/:id/follower', (req, res) => {
});

// 특정 게시글 전부 가져오기
router.get('/:id/posts', (req, res) => {
});

module.exports = router;