const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {

    // req.login()이 호출되면 이 부분이 실행되고
    passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨

        console.log('### passport.serializeUser... ###');

        // 여기의 user._id가 req.session.passport.user에 저장
       return done(null, user.id); // return 안해도 되는데 뒷 부분이 실행 안된다는 안전장치로 해둔다.
    });


    // 프론트에서 쿠키를 보내주면 deserializeUser()가 실행되서
    // req.user로 사용하게 된다.

    // 매 요청 시마다 app.use(passport.session()); 가 실행되는데
    // 여기서 passport.deserializeUser() 이 부분이 실행되고
    // user.id로 DB 조회 후에 온전한 user 정보를 req.user에 저장한다.
    passport.deserializeUser(async (id, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값

        console.log('### passport.deserializeUser... ###');

       try {
           const user = await db.User.findOne({
              where: { id },
           });

           // req.user에 저장된다.
           // '/' 경로에서 req.user를 호출하면 done()의 유저 정보가 들어있다.
           // 패스포트를 사용하지 않으면 request 객체는 user라는 속성을 가지고 있지 않다.
           return done(null, user); // req.user

       } catch (e) {
           console.error(e);
           return done(e);
       }
    });

    local();
};

// 프론트에서 서버로는 cookie만 보낸다. (DFy47r)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 1 발견
// req.user로 사용자 정보가 들어감

// 요청 보낼때 마다 deserializeUser가 실행된다. (db 요청 1번마다 실행된다.)
// 실무에서는 deserializeUser 결과물을 캐싱한다.