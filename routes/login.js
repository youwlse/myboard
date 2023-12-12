// Express 및 라우터 모듈 불러오기
const express = require('express');
const router = express.Router();
const sha = require('sha256'); // 암호화 모듈

// 로그인 페이지 렌더링
router.get('/login', function(req, res){
    // 이미 로그인한 경우 세션 유지하고 인덱스 페이지로 이동
    if(req.session.user){
        console.log('세션 유지');
        res.render('index.ejs', {user: req.session.user});
    } else {
        // 로그인되어 있지 않은 경우 로그인 페이지 렌더링
        res.render('login.ejs');
    }
});

// 로그인 처리
router.post("/login", function (req, res) {
    let mydb = req.app.get('mydb');

    // 입력받은 아이디로 사용자 조회
    mydb.collection('account').findOne({ userid: req.body.userid })
    .then(result => {
        // 조회 결과가 있고, 비밀번호가 일치하는 경우 세션 생성 후 인덱스 페이지로 이동
        if(result && result.userpw == sha(req.body.userpw)){
            req.session.user = req.body;
            console.log('새로운 로그인');
            res.render('index.ejs',{user: req.session.user});
        } else {
            // 조회 결과가 없거나 비밀번호가 일치하지 않는 경우 오류 메시지 출력
            res.send('<script>alert("비밀번호가 틀렸습니다. 다시 시도해주세요."); window.location="/login";</script>');
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send();
    });
});

// 로그아웃 처리
router.get('/logout', function(req, res){
    console.log('로그아웃');
    // 세션 제거 및 세션 쿠키 삭제 후 인덱스 페이지로 이동
    req.session.destroy();
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    res.render('index.ejs',{user: null});
});

// 회원탈퇴 처리
router.get('/withdraw', async function(req, res){
    let mydb = req.app.get('mydb');
    
    // 로그인한 경우에만 회원탈퇴 수행
    if(req.session.user){
        let userId = req.session.user.userid;
        // 사용자의 친구 목록 조회
        const user = await mydb.collection('account').findOne({ userid: userId });
        const friends = user.userfriends || [];

        // 계정 삭제
        mydb.collection('account').deleteOne({ userid: userId })
        .then(result => {
            console.log('계정 삭제 완료');

            // 작성한 글 삭제 및 친구 목록에서 제거
            mydb.collection('post').deleteMany(
                { $or: [{ userid: userId}, { userid: { $in: friends }}]},
                { $pull: { userfriends: userId }}
            )
            .then(postsResult => {
                console.log('작성한 글 삭제 및 친구 목록에서 제거 완료');
                res.redirect('/logout');
            })
            .catch(postsErr => {
                console.log(postsErr);
                res.status(500).send();
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
    } else {
        // 로그인되어 있지 않은 경우 로그인 페이지로 이동
        res.redirect('/login');
    }
});

// 라우터 모듈 내보내기
module.exports = router;