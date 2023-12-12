// 회원가입과 관련된 Express 및 필요한 모듈
const express = require('express');
const sha = require('sha256'); // 암호화 모듈
const router = express.Router(); // Express의 라우터를 사용하여 라우팅을 설정

// 회원가입 페이지를 렌더링하는 라우트
router.get('/signup', function(req, res){
    // 이미 로그인한 사용자가 회원가입 페이지에 접근하면 로그인 페이지로 리다이렉트
    if (req.session.user) {
        res.redirect('/login');
        return;
    } 
    console.log('회원가입'); // 콘솔에 회원가입 메시지를 출력
    res.render('signup.ejs', { user: null }); // signup.ejs를 렌더링하며, 사용자 정보를 null로 전달
});

// 회원가입 데이터를 저장하는 라우트
router.post('/signup', async function(req, res){
    let mydb = req.app.get('mydb'); // Express 애플리케이션에서 MongoDB 데이터베이스를 가져옴.
    console.log(req.body); // 요청 바디의 내용을 콘솔에 출력

    // MongoDB의 'account' 컬렉션에 회원 데이터를 삽입
    mydb.collection('account').insertOne({
        userid: req.body.userid,
        userpw: sha(req.body.userpw), // 사용자 비밀번호를 sha256 해시로 암호화
        usergroup: req.body.usergroup,
        useremail: req.body.useremail,
        userfriends: req.body.userfriends || [] // 사용자 친구 목록을 받아오거나 빈 배열로 초기화
    }).then(result => {
        console.log(result);
        console.log('회원가입 성공'); // 삽입이 성공하면 콘솔에 성공 메시지를 출력
    });

    res.redirect('/'); // 회원가입이 완료되면 홈페이지로 리다이렉트
});

module.exports = router; // 라우터를 모듈로 내보낸다.