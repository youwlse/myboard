const express = require('express');
const router = express.Router();

// 친구 목록 페이지 렌더링
router.get('/friendlist', async function(req, res) {
    if (!req.session.user) {
        // 로그인 되어 있지 않으면 로그인 페이지로 리다이렉트
        res.redirect('/login');
    } else {
        let mydb = req.app.get('mydb');
        const currentUserID = req.session.user.userid;

        // 현재 사용자의 정보 조회
        const user = await mydb.collection('account').findOne({ userid: currentUserID });

        // 현재 사용자의 친구 목록 조회
        const friends = user.userfriends;

        res.render('friendlist.ejs', { user: req.session.user, friends: friends });
    }
});

// 친구 삭제 요청 처리
router.post('/friendlist/delete/:friendID', async function(req, res) {
    if (!req.session.user) {
        // 로그인 되어 있지 않으면 로그인 페이지로 리다이렉트
        res.redirect('/login');
    } else {
        let mydb = req.app.get('mydb');
        const currentUserID = req.session.user.userid;
        const friendID = req.params.friendID;

        try {
            // 현재 사용자의 정보 조회
            const user = await mydb.collection('account').findOne({ userid: currentUserID });

            // 현재 사용자의 친구 목록에서 선택한 친구 제거
            user.userfriends = user.userfriends.filter(friend => friend !== friendID);

            // 업데이트된 친구 목록을 데이터베이스에 저장
            await mydb.collection('account').updateOne({ userid: currentUserID }, { $set: { userfriends: user.userfriends } });

            // 성공적으로 삭제되면 친구 목록 페이지로 리다이렉트
            res.redirect('/friendlist');
        } catch (error) {
            console.error('친구 삭제 중 오류 발생:', error);
            // 오류가 발생하면 에러 페이지로 리다이렉트 또는 적절한 에러 처리를 수행할 수 있습니다.
            res.redirect('/friendlist');
        }
    }
});

module.exports = router;