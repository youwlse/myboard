const express = require('express');
const router = express.Router();

// 친구들의 게시물 페이지 렌더링
router.get('/friendpost', async function (req, res) {
    // 로그인한 사용자만 접근 가능하도록 체크
    if (!req.session.user) {
        // 로그인하지 않은 경우 로그인 페이지로 이동
        res.redirect('/login');
        return;
    }
//mydb 가져오고 현재 아이디를 세션 아이디로 지정
    const mydb = req.app.get('mydb');
    const currentUserID = req.session.user.userid;

    try {
        // 현재 사용자의 정보 조회
        const user = await mydb.collection('account').findOne({ userid: currentUserID });

        // 현재 사용자의 친구 목록 조회
        const friendIDs = user.userfriends;
        
        // 친구들의 게시물 가져오기
        const friendPosts = await mydb.collection('post').find({ userid: { $in: friendIDs } }).toArray();

        res.render('friendpost.ejs', { friendPosts: friendPosts, user: req.session.user });
    } catch (error) {
        console.error('친구들의 게시물 조회 중 오류 발생:', error);
        // 오류가 발생하면 에러 페이지로 리다이렉트 또는 적절한 에러 처리를 수행할 수 있습니다.
        res.redirect('/home');
    }
});

module.exports = router;