const express = require('express');
const router = express.Router();

// 내 정보 조회
router.get('/', (req, res) => { //   /api/user/
});

// 사용자 등록
router.post('/', (req, res) => {
});

// 다른 사람 정보 조회
// ex) /api/user/3
// :id는 req.params.id로 가져올 수 있다.
router.get('/:id', (req, res) => {

});

// 로그아웃
router.post('/logout', (req, res) => {  //   /api/user/logout
});

// 로그인
router.post('/login', (req, res) => {
});

// 특정 유저의 팔로워 목록 가져오기
router.get('/:id/follow', (req, res) => {   //   /api/user/:id/follow
});

// 특정 유저의 팔로우 하기
router.post('/:id/follow', (req, res) => {
});

// 특정 유저 팔로우 취소하기
router.delete('/:id/follow', (req, res) => {
});

// 특정 유저 팔로우 삭제하기
router.delete('/:id/follower', (req, res) => {
});

// 특정 게시글 전부 가져오기
router.get('/:id/posts', (req, res) => {
});

module.exports = router;