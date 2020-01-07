const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../models');
const {isLoggedIn} = require('./middleware');

const router = express.Router();


const upload = multer({
    // 파일 업로드에 대한 설정
    // 이미지 외에 파일,동영상 같은 것도 올릴 수 있습니다.

    // 서버쪽 드라이브에 저장한다는 의미입니다.
    // 이걸 나중에 S3 or Google Cloud로 바꿔서 저장할 수 있습니다.
    storage: multer.diskStorage({

        // 어떤 경로에 저장할 지 설정
        destination(req, file, done) {

            // done()는 passport의 done()이라고 생각하면 될 것 같습니다.
            // 첫번째 인자: 서버 에러
            // 두번째 인자 : 성공 시 인자 (back/uploads)
            done(null, 'uploads');
        },

        // 파일 이름 설정
        filename(req, file, done) {
            // file.originalname: 기존 파일명이 들어있습니다.
            // 해당 파일에서 확장자를 추출합니다.
            const ext = path.extname(file.originalname);

            // 확장자를 제외한 이름을 추출해낸다.
            const basename = path.basename(file.originalname, ext); // nodeproject.png, ext === .png, basename === nodeproject

            done(null, basename + new Date().valueOf() + ext);
        },
    }),

    // 파일 사이즈 제한
    limits: {fileSize: 20 * 1024 * 1024},

    // 동시 업로드 파일 제한도 있는데 따로 알아봐야합니다.

});

// 게시글 작성완료
// isLoggedIn: routes/middleware.js
// 원래는 두번째 인자에 async (req, res, next) 가 있었지만
// 공통되는 부분 미들웨어로 만들어서 두번째 인자로 해당 미들웨어를 넘겨준다.

// 이미지가 아니라 주소(텍스트)만 업로드하기 때문에 upload.none()을 사용한다.
// 폼데이터 파일: req.file(s)
// 폼데이터 일반 값: upload.none() -> req.body
// req.body에 담기기 때문에 formData에 넘어온 값은 req.body.image(텍스트), req.body.content(글내용)에 담긴다.
// 여기서 upload.none()는 없어도 되는데 fromData로 컨텐츠 전송을 연습삼아 해봤다.
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post
    console.log('### back/routes/post.js... router.post(\'/\')... req.body.content: ', req.body.content, ' ###');

    try {

        const hashtags = req.body.content.match(/#[^\s]+/g);

        console.log(`hashtags: ${JSON.stringify(hashtags)}`);

        const newPost = await db.Post.create({
            content: req.body.content, // ex) '리액트 배우기 #힘내자 #별거아니야'
            UserId: req.user.id,
        });

        // console.log(`### hashtags: ${hashtags} ###`);
        // console.log(`### newPost: ${newPost} ###`);

        if (hashtags) {

            // hashtags 테이블에 글 내용에 입력된 태그들을 각각 저장한다.
            // fineOrCreate(): 검색 결과가 없으면 만들고 있으면  조회해서 반환한다. (없어도 반환되는 건 똑같다.)
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: {name: tag.slice(1).toLowerCase()},
            })));

            console.log(`### back/routes/post.js... result: ${JSON.stringify(result)} ###`);
            console.log(`### back/routes/post.js... before newPost.addHashtags(): ${JSON.stringify(newPost)} ###`);
            result.map(r => console.log(`r[0]: ${JSON.stringify(r[0])}`));

            // newPost는 새로 작성되는 글이고
            // result는 contents의 태그가 붙인 이름을 hashtags 테이블에서 검색하고 조회한다.
            // 글 내용중 태그가 " #파폭 #왓더 " 라고 가정한다면
            // SELECT `createdAt`, `updatedAt`, `HashtagId`, `PostId` FROM `PostHashtag` AS `PostHashtag` WHERE `PostHashtag`.`PostId` = 31 AND `PostHashtag`.`HashtagId` IN (13, 14);
            // INSERT INTO `PostHashtag` (`createdAt`,`updatedAt`,`HashtagId`,`PostId`) VALUES ('2019-12-22 02:23:57','2019-12-22 02:23:57',13,31),('2019-12-22 02:23:57','2019-12-22 02:23:57',14,31);
            // 이렇게 쿼리문을 날리는데 newPost의 id를 포함하고 result에 저장된 태그들을 모아서 한번에 posthashtag에 저장한다.
            // 쉽개 생각하면 newPost 이 값이 테이블에 게시글을 작성하고 반환 받은 시퀄라이즈 객체이고
            // 이 post 객체는 이미 시퀄라이즈 객체이니 시퀄라이즈는 알아차려서 add+테이블 이름
            // 이 경우는 다대다 관계이기 때문에 중간에 though 테이블에 posts 테이블 기준으로 해시태그를 추가한다는 의미이다.
            await newPost.addHashtags(result.map(r => r[0]));
            console.log(`### back/routes/post.js... after newPost.addHashtags(): ${JSON.stringify(newPost)} ###`);

        }

        // 이미지 주소가 있다면
        console.log(`### back/routes/post.js... req.body.image: ${JSON.stringify(req.body.image)} ###`);
        if (req.body.image) {

            if (Array.isArray(req.body.image)) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]

                const images = await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({src: image});
                }));

                console.log('### back/routes/post.js... await Promise.all(image):', images ,' ###');
                await newPost.addImages(images); // 복수라서 addImages : s가 붙는다 시퀄라이즈에서 제공해주는 메소드

            } else { // 하나만 올리면 image: 주소1
                const image = await db.Image.create({src: req.body.image});
                await newPost.addImage(image); // 하나인 경우 addImage() 단수 이 메소드는 시퀄라이즈에서 생성해준다.
            }
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
            where: {id: newPost.id},
            include: [{
                model: db.User,
            }, {
                model: db.Image,
            }],
        });

        // 여기서 fullPost가 아니라 newPost를 반환하였더니
        // 로그인 후 게시글 작성 시 새로고침되고 로그인이 풀린다.
        res.json(fullPost);

    } catch (e) {
        console.error(e);
        next(e);
    }

});

// 이미지 등록하기


// upload.array()의 이름은 front/PostForm에서 ImageFormData.append()의 첫번째 인자의 이름
// upload.single() : 하나
// upload.array() : 여러개
// upload.fields() : 파일마다 이름이 다를 시 사용
// upload.none() : 이미지나 파일 등을 하나도 안올린 것
// 이렇게 사용하면 알아서 이미지가 업로드 된다.
router.post('/images', upload.array('image'), (req, res) => {

    console.log(`back/routes/post.js... router.post('/images', upload.array('image'), (req, res)... req.files: ${JSON.stringify(req.files)}`);

    // req.file: 파일 한개일 시 여기에 저장 됩니다.
    // req.files: 파일 여러개 일 시 여기에 저장 됩니다.
    res.json(req.files.map(v => v.filename));

});

// 댓글 가져오기
router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({where: {id: req.params.id}});
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }

        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            order: [['createdAt', 'ASC']],
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });

        res.json(comments);

    } catch (e) {
        console.error(e);
        next(e);
    }
});

// 댓글 등록하기
router.post('/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/3/comment
    console.log(`### back/routes/post.js... router.post('/:id/comment', async (req, res, next)... ###`);

    try {

        const post = await db.Post.findOne({where: {id: req.params.id}});
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        console.log(`### back/routes/post.js... await db.Post.findOne()... post: ${JSON.stringify(post)} ###`);

        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });

        await post.addComment(newComment.id);

        const comment = await db.Comment.findOne({
            where: {
                id: newComment.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        console.log(`### back/routes/post.js... await db.Comment.findOne()... comment: ${JSON.stringify(comment)} ###`);

        return res.json(comment); // return은 사용하지 않아도 된다.
    } catch (e) {
        console.err(e);
        next(e);
    }
});

module.exports = router;