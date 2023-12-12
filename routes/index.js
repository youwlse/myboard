const express = require('express');
const router = express.Router();

// 루트 경로로 들어왔을 때 index.html 파일 전송
router.get("/", function (req, res) {
    if (!req.session.user) {
         //로그인 하지 않은상태면
        res.redirect('/login');
        return;
    }
    res.render('index.ejs',{user:null});
});

module.exports = router;