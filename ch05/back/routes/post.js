const express = require('express');
const db = require('../models');
const router = express.Router();


// 게시글 작성완료
router.post('/', async (req, res, next) => { // POST /api/post

    console.log(`### POST /api/post... ###`);

    try {

        const hashtags = req.body.content.match(/#[^\s]+/g);
        const newPost = await db.Post.create({
            content: req.body.content, // ex) '리액트 재밌다 #힘내자 #별거아니야'
            UserId: req.user.id,
        });

        console.log(`### hashtags: ${hashtags} ###`);
        console.log(`### newPost: ${newPost} ###`);

        if(hashtags) {

            // fineOrCreate(): 없으면 만들고 있으면 아무것도 안한다.
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() },
            })));
            
            console.log(`### result: result ###`);
            await newPost.addHashtags( result.map(r => r[0]) );
            
        }


        // 방법 1.
        // 시퀄라이즈에서  getUser(), addUser(), addComment(), removeUser() 이런식으로 자동으로 생성해주니
        // 그 메서드들을 사용할 수도 있다.
        //
        // const User = await newPost.getUser();
        // newPost.User = User;
        // res.json(newPost);


        // 방법 2.
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
            }],
        });

        res.json(newPost);
    } catch(e) {
        console.error(e);
        next(e);
    }

});

// 이미지 등록하기
router.post('/images', (req, res) => {

});

module.exports = router;