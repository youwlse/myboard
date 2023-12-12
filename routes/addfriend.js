const express = require('express');
const router = express.Router();

// 친구 추가 페이지 렌더링
router.get('/addfriend', async function(req, res) {
    if (!req.session.user) {
        // 로그인 되어 있지 않으면 로그인 페이지로 리다이렉트
        res.redirect('/login');
    } else {
        const mydb = req.app.get('mydb');
        const currentUserID = req.session.user.userid;

        // 사용자의 친구 목록 조회
    const userFriends = await mydb.collection('account').findOne({ userid: currentUserID }).then(user => user.userfriends || []);

    // 전체 사용자 중에서 친구가 아니면서 자신의 ID도 아닌 사용자들을 추천 친구로 설정
    const allUsers = await mydb.collection('account').find({ userid: { $nin: [currentUserID, ...userFriends] } }).toArray();
    const recommendedFriends = allUsers.map(user => user.userid);

    // 데이터를 가져온 후에 템플릿 렌더링
    res.render('addfriend.ejs', { user: req.session.user, errorMessage: null,recommendedFriends});
    }
});


// 친구 추가 기능 처리
router.post('/addfriend', async function(req, res) {
    let mydb = req.app.get('mydb');
    const currentUserID = req.session.user.userid;
    const friendID = req.body.friendid;

    // 해당 ID가 account 테이블에 존재하는지 확인
    const friendExists = await mydb.collection('account').findOne({ userid: friendID });

    if (friendExists && friendID !== currentUserID) {
        // 현재 사용자의 userfriends에 친구 추가
        await mydb.collection('account').updateOne({ userid: currentUserID }, { $push: { userfriends: friendID } });
        res.redirect('/friendlist');
    } else {
        if (friendID === currentUserID) {
            // 자신의 아이디는 추가할 수 없도록 에러 메시지 표시
            res.render('addfriend.ejs', { user: req.session.user, errorMessage: '자신의 아이디는 추가할 수 없습니다.' });
        } else {
            // 해당 ID가 존재하지 않는 경우 에러 메시지 표시
            res.render('addfriend.ejs', { user: req.session.user, errorMessage: '존재하지 않는 아이디입니다.' });
        }
    }
});

module.exports = router;


