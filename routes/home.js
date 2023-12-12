const express = require('express');
const router = express.Router();

// 사용자 전용 블로그 페이지
router.get('/home', function (req, res) {
    // 로그인한 사용자만 접근 가능하도록 체크
    if (!req.session.user) {
        // 로그인하지 않은 경우 로그인 페이지로 이동
        res.redirect('/login');
        return;
    }

    const mydb = req.app.get('mydb');

    // 현재 사용자의 게시물 가져오기
    mydb.collection('post').find({ userid: req.session.user.userid }).toArray()
    .then(userPosts => {
        // 현재 사용자의 친구 목록 조회
        const friends = req.session.user.userfriends;

        // 최근 친구의 게시물을 가져오기
        if (friends && friends.length > 0) {
            const recentFriendId = friends[0]; // 가장 최근에 추가된 친구

            // 최근 친구의 게시물을 가져오기
            mydb.collection('post').find({ userid: recentFriendId }).toArray()
                .then(friendsPosts => {
                    // 렌더링 시에 userPosts와 friendsPosts를 함께 전달
                    res.render('home.ejs', { userPosts: userPosts, user: req.session.user, friendsPosts: friendsPosts });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send();
                });
        } else {
            // 친구가 없을 때 또는 친구가 글을 작성하지 않았을 때의 처리
            res.render('home.ejs', { userPosts: userPosts, user: req.session.user, friendsPosts: [] });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    });

});

module.exports = router;
