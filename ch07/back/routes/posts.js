const express = require('express');
const db = require('../models');

const router = express.Router();

// 게시글 가져오기
router.get('/', async (req, res, next) => { // GET /api/posts

    try {

        // lastId 없으면 ('0'이면) 처음부터 불러오고
        // 아이디가 있으면 그 아이디보다 작은 아이디의 게시글들을 불러온다.
        let where = {};
        if(parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    // lastId보다 작은 id (less than)
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // sequelize operator
                },
            };

        }

        // lastId가 없는 경우 처음부터 가져온다.
        const posts = await db.Post.findAll({

            where,

            // 조건은 없는데 작성자만 가져온다.
            include: [{
                // 게시글을 작성한 사람을 include 해주는 부분
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

            order: [['createdAt', 'DESC']], // 2차원 배열인 이유는 조건을 여러개 줄 수 있다.
            // order: [ ['createdAt', 'DESC'], [updatedAt, 'ASC'] ],

            limit: parseInt(req.query.limit, 10),
        });

        res.json(posts);

    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;