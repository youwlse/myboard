const express = require('express');
const router = express.Router();

// 사용자 전용 블로그 페이지를 처리하는 라우트
router.get('/userblog', function (req, res) {
    // 로그인한 사용자만 접근 가능하도록 체크
    if (!req.session.user) {
        // 로그인하지 않은 경우 로그인 페이지로 이동
        res.redirect('/login');
        return;
    }

    const mydb = req.app.get('mydb'); // Express 애플리케이션에서 MongoDB 데이터베이스를 가져옴.

    // 현재 로그인한 사용자의 아이디로 해당 사용자의 게시물을 가져오기
    mydb.collection('post').find({ userid: req.session.user.userid }).toArray()
        .then(result => {
            // 사용자 블로그 페이지를 렌더링하며, 게시물 데이터와 현재 로그인한 사용자 정보를 전달한다.
            res.render('userblog.ejs', { data: result, user: req.session.user })
                .catch(err => {
                    console.log(err);
                    res.status(500).send();
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router; // 라우터를 모듈로 내보낸다.