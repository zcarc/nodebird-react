const passport = require('passport');
const db = require('../models');

module.exports = () => {

    passport.serializeUser((user, done) => {

       return done(null, user.id); // return 안해도 되는데 뒷 부분이 실행 안된다는 안전장치로 해둔다.
    });


    passport.deserializeUser(async (id, done) => {

       try {
           const user = await db.User.findOne({
              where: { id },
           });

           return done(null, user);

       } catch (e) {
           console.error(e);
           return done(e);
       }
    });
};