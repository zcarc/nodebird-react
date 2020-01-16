const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models'); // index에 db.User()로 연결되어 있기 때문에 불러오면 어디서든 쓸 수 있다.
const {isLoggedIn} = require('./middleware');

const router = express.Router();

// 내 정보 조회
router.get('/', isLoggedIn, (req, res) => { //   /api/user/
    console.log(`### back/routes/user... get('/')`);

    const user = Object.assign({}, req.user.toJSON());
    console.log('### back/routes/user... user: ', user, ' ###');
    delete user.password;
    return res.json(user);
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

        if (exUser) {
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

        // console.log(`newUser: ${newUser}`);
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
router.get('/:id', async (req, res, next) => {

    console.log(`### back/routes/user.js router.get('/:id'... ###`);

    try {
        const user = await db.User.findOne({
            where: {id: parseInt(req.params.id, 10)},
            include: [{
                model: db.Post,
                as: 'Posts',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followers',
                attributes: ['id'],
            }],
            attributes: ['id', 'nickname'],
        });

        // 다른사용자의 팔로잉이나 팔로워가 개인정보 노출이 될 수 있으므로 숫자만 보냄
        const jsonUser = user.toJSON();

        console.log(`### back/routes/user.js router.get('/:id' user: ${JSON.stringify(user)} ###`);
        console.log(`### back/routes/user.js user.toJSON(): ${JSON.stringify(jsonUser)} ###`);

        jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
        jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
        jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;

        // pages/user.jsx에 보냄
        res.json(jsonUser);

    } catch (e) {
        console.error(e);
        next(e);
    }

});

// 로그아웃
router.post('/logout', (req, res) => {  //   /api/user/logout

    // 아래 두개만 적어주면 알아서 로그아웃이 된다.
    req.logout();
    req.session.destroy();

    res.send('Logout 성공');
});

// 로그인
router.post('/login', (req, res, next) => { // POST /api/user/login
    console.log("### router.post('/login', ...) ###");

    // 먼저 passport/local.js로 넘어가게 된다.
    // (err, user, info) : done() 메서드의 첫번째 인자 err, 두번째 인자 user, 세번째 인자 info
    passport.authenticate('local', (err, user, info) => {
        console.log('### back/routes/user... passport.authenticate... err:', err, ' ###');
        console.log('### back/routes/user... passport.authenticate... user:', user, ' ###');
        console.log('### back/routes/user... passport.authenticate... info:', info, ' ###');

        // 서버 에러가 있을 시
        if (err) {
            console.error(err);
            return next(err); // express가 알아서 서버로 에러를 보내준다.
        }

        // 로직 상의 에러가 있을 시
        if (info) {
            return res.status(401).send(info.reason); //send() : 문자열로 이유를 보낸다.
        }

        // 로그인 성공 시 서버에 쿠키와 세션이 저장된다.
        // req.login()을 할 때 passport/index.js의 passport.serializeUser()가 실행된다.
        // serializeUser()의 매개변수 user는 req.login(user, ...)의 첫번째 인자가 전달된다.
        // 로그인 성공한 유저의 id를 새로 빼고 쿠키는 새로 만들어서 [{id: 1, cookie: 'DFy47r'}] 이런식으로 익스프레션 세션에 저장된다.
        return req.login(user, async (loginErr) => {

            try {
                // console.log('### req.login: ', user, ' ###');

                // 로그인하면서 에러가 발생 시 *이런 경우는 아주아주 드물지만 혹시나 해서 해준다.
                if (loginErr) {
                    return next(loginErr);
                }

                const fullUser = await db.User.findOne({
                    where: {id: user.id},
                    include: [{
                        model: db.Post,
                        as: 'Posts',
                        attributes: ['id'], // id만 가져온다.
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'nickname', 'userId'], // 사용자 정보는 패스워드만 제외하고 프론트로 보낸다.
                });
                console.log('### fullUser: ', fullUser, '###');
                return res.json(fullUser);
                // // 패스워드가 담겨 있으니 얕은 복사를 한 후에
                // // 패스워드를 삭제하고 프론트에 보내준다.
                // const filteredUser = Object.assign({}, user.toJSON());
                // delete filteredUser.password;

                // console.log('### filteredUser: ', filteredUser, ' ###');

                // // 프론트에 사용자 정보를 JSON 형태로 보내준다.
                // return res.json(filteredUser);
            } catch (e) {
                console.error(e);
                next(e);
            }
        });
    })(req, res, next);

});

// 내가 팔로잉하는 사람 목록 가져오기
router.get('/:id/followings', isLoggedIn, async (req, res, next) => {   //   /api/user/:id/followings

    try {

        const user = await db.User.findOne({
            // req.params.id가 0이라면 본인이라고 간주한다.
            where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
        });

        // user의 followers를 찾아준다.
        // 시퀄라이즈에서 생성해주는 함수
        // findOne처럼 똑같은 옵션을 줄 수 있다.
        const followers = await user.getFollowings({
            attributes: ['id', 'nickname'],
        });
        res.json(followers);

    } catch (e) {
        console.error(e);
        next(e);
    }
});

// 나를 팔로워하는 사람 목록 가져오기
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {   //   /api/user/:id/followers
    try {

        const user = await db.User.findOne({
            // req.params.id가 0이라면 본인이라고 간주한다.
            where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
        });

        // user의 followers를 찾아준다.
        // 시퀄라이즈에서 생성해주는 함수
        // findOne처럼 똑같은 옵션을 줄 수 있다.
        const followers = await user.getFollowers({
            attributes: ['id', 'nickname'],
        });
        res.json(followers);

    } catch (e) {
        console.error(e);
        next(e);
    }
});

// 팔로워 삭제하기
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try {

        const me = await db.User.findOne({
            where: { id: req.user.id },
        });

        await me.removeFollower(req.params.id);
        res.send(req.params.id);

    } catch (e) {
        console.error(e);
        next(e);
    }
});

// 특정 유저의 팔로우 하기
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {

    try {

        const me = await db.User.findOne({
            where: {id: req.user.id},
        });

        // 내가 남을 팔로잉하게 연결해준다.
        await me.addFollowing(req.params.id);

        res.send(req.params.id);

    } catch (e) {
        console.log(e);
        next(e);
    }
});

// 특정 유저 팔로우 취소하기
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {

    try {

        const me = await db.User.findOne({
            where: {id: req.user.id},
        });

        // 내가 다른사람을 팔로잉하고 있는 상태를 취소한다.
        await me.removeFollowing(req.params.id);

        res.send(req.params.id);

    } catch (e) {
        console.log(e);
        next(e);
    }
});

// 특정 게시글 전부 가져오기
router.get('/:id/posts', async (req, res, next) => {

    try {
        const posts = await db.Post.findAll({
            where: { // post 테이블 기준 조건
                // req.params.id가 0이라면 본인이라고 간주한다.
                UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
                RetweetId: null, // 남이 리트윗한거 빼고 내가 쓴거만 가져옴
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'], // password 제외
            }, {
                model: db.Image,
            }, {
                // 게시글을 좋아요한 사람을 include
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
        });

        res.json(posts);

    } catch (e) {
        console.log(e);
        next(e);
    }
});

// 닉네임 수정
router.patch('/nickname', isLoggedIn, async (req, res, next) => {

    try {

        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: {id: req.user.id},
        });

        res.send(req.body.nickname);

    } catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;