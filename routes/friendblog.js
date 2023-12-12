// Express 및 라우터 모듈 불러오기
const express = require('express');
const router = express.Router();

// 사용자 블로그 페이지 렌더링
router.get('/friendblog/:friendID', function (req, res) {
    // 로그인한 사용자만 접근 가능하도록 체크
    if (!req.session.user) {
        // 로그인하지 않은 경우 로그인 페이지로 이동
        res.redirect('/login');
        return;
    }
//mydb 가져오기
    const mydb = req.app.get('mydb');
    const friendID = req.params.friendID;

    // 해당 친구의 게시물 가져오기
    mydb.collection('post').find({ userid: friendID }).toArray()
        .then(result => {
            // 렌더링 시 게시물 데이터와 현재 로그인한 사용자 정보 전달
            res.render('friendblog.ejs', { data: result, user: req.session.user });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

// 라우터 모듈 내보내기
module.exports = router;