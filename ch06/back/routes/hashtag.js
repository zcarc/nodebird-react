const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/:tag', async (req, res, next) => {

    console.log(`### back/routes/hashtag.js... ###`);

    try {
        const posts = await db.Post.findAll({
            include: [{
                model: db.Hashtag,
                where: {name: decodeURIComponent(req.params.tag)}, // 이 조건은 User 테이블에 대한 조건 (Post 테이블 기준이 아님) // 한글일수도 있으므로 함수 사용
            }, {
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            }, {
                // 게시글을 좋아요한 사람을 include
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image,
                }]
            }],
        });

        res.json(posts);

    } catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;