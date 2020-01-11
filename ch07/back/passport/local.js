const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {

    // 여기로 넘어오면 요청으로 받은 req.body의 정보를 받게 되는데
    // 여기서 사용자의 id, password 의 key 값들
    // usernameField, passwordField에 각각 넣어줘야한다.
    // 그리고 그 다음 async가 붙은 함수가 실행된다.
    passport.use(new LocalStrategy({
        usernameField: 'userId', // req.body.userId
        passwordField: 'password', // req.body.password

    }, async (userId, password, done) => {

        console.log('### back/passport/local.js async... ###');

        try {

            const user = await db.User.findOne({ where: { userId } });

            // done()이 실행되면 passport.authenticate()의 두번째 인자 함수의 매개변수에 전달된다.
            if (!user) {
                console.log('존재하지 않는 사용자입니다.');
                return done(null, false, {reason: '존재하지 않는 사용자입니다.'});
            }

            const result = await bcrypt.compare(password, user.password);
            if (result) {
                return done(null, user);
            }
            console.log('비밀번호가 틀립니다.');
            return done(null, false, {reason: '비밀번호가 틀립니다.'});

        } catch (e) {
            console.error(e);
            return done(e);
        }
    }));
};