// 중복되는 부분을 미들웨어로 만들어서 사용해준다.
exports.isLoggedIn = (req, res, next) => {

    // 로그인 상태라면 다음 미들웨어로 넘어간다. (isLoggedIn을 호출하는 미들웨어)
    // req.isAuthenticated() : 로그인 여부를 확인하는 공식적인 함수
    if(req.isAuthenticated()) {
        // 여기다가 에러를 넣으면 에러처리 미들웨어로 넘거가지만
        // 아무것도 안넣으면 다음 미들웨어로 넘어간다.
        // 에러처리 미들웨어는 Express에서 기본적으로 제공한다.
        next();
    } else {
        console.log('### back/routes/middleware... 로그인이 필요합니다.');
        res.status(401).send('로그인이 필요합니다.');
    }
};


exports.isNotLoggedIn = (req, res, next) => {

    if(!req.isAuthenticated()) {
        next();
    } else {
        console.log('### back/routes/middleware... 로그인한 사용자는 접근할 수 없습니다.');
        res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
    }
};