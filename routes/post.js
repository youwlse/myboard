// 필요한 모듈 및 라우터 불러오기
const fs = require('fs');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB 폼 입력을 받는 페이지로 이동하는 라우트
router.get('/entermongo', function (req, res) {
    // 로그인한 경우 폼 입력 페이지 렌더링
    if (req.session.user) {
        console.log('세션 유지');
        res.render('enter.ejs', { user: req.session.user });
    } else {
        // 로그인되어 있지 않은 경우 로그인 페이지로 이동
        res.render('login.ejs');
    }
});

// MongoDB에 저장된 데이터 목록을 보여주는 라우트
router.get("/listmongo", function (req, res) {
    const mydb = req.app.get('mydb');
    // 로그인한 경우에만 목록 페이지 렌더링
    if (req.session.user) {
        mydb.collection('post').find().toArray().then(result => {
            console.log(result);
            // 목록 페이지 렌더링 및 데이터 전달
            res.render('list_mongo.ejs', { data: result, user: req.session.user });
        });
    } else {
        // 로그인되어 있지 않은 경우 로그인 페이지로 이동
        res.render('login.ejs');
    }
});

// 이미지와 문서를 포함한 데이터를 저장하는 라우트
router.post('/savemongo', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), function (req, res) {
    // 로그인하지 않은 경우 로그인 페이지로 이동
    if (!req.session.user) {
        res.redirect('/login');
        return;
    } 
        
    const mydb = req.app.get('mydb');

    console.log(req.session.user);
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.files); // 업로드된 이미지 및 문서에 대한 정보

    let now = new Date();
    let documentContent = '';

    const documentFiles = req.files.document; 
    if (documentFiles && documentFiles.length > 0) { 
        const documentFile = documentFiles[0]; 
        documentContent = documentFile.buffer.toString('utf-8'); // 문서 파일 내용을 문자열로 변환
    }

    let imageData = null; //이미지 데이터 null
    if (req.files.image && req.files.image.length > 0) {
        const imageFile = req.files.image[0];
        imageData = imageFile.buffer; //이미지를 버퍼로 저장
    }

    // MongoDB에 데이터 저장
    mydb.collection('post').insertOne(
        {
            userid: req.session.user.userid,
            title: req.body.title,
            content: req.body.content + '\n\n' + documentContent, // 문서 내용 추가
            date: req.body.someDate,
            image: imageData // 이미지 데이터를 MongoDB에 저장
        })
        .then(result => {
            console.log(result);
            console.log('데이터 추가 성공');
            // 데이터 추가 완료 후 사용자 블로그 페이지로 리다이렉트
            res.redirect('/userblog');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('데이터 추가 실패');
        });
});

// 선택한 게시물을 삭제하는 라우트
router.post("/delete", function (req, res) { 
    console.log(req.body);
    req.body._id = new ObjectId(req.body._id); 
    const mydb = req.app.get('mydb');

    // MongoDB에서 선택한 게시물 삭제
    mydb.collection('post').deleteOne(req.body) 
        .then(result => {
            console.log('삭제 완료');
            res.status(200).send();
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

// 라우터 모듈 내보내기
module.exports = router;