const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/:tag', async (req, res, next) => {

    try {
        const posts = await db.Post.findAll({
           include: [{
             model: db.Hashtag,
             where: { name: decodeURIComponent(req.params.name) }, // 이 조건은 User 테이블에 대한 조건 (Post 테이블 기준이 아님) // 한글일수도 있으므로 함수 사용
           }, {
               model: db.User,
               attributes: ['id', 'nickname'],
           }],
        });

        res.json(posts);

    }catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;