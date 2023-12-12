// Express 및 필요한 모듈 불러오기
const express = require('express');
const { ObjectId } = require('mongodb');
const multer = require('multer');  // 파일 업로드 처리를 위한 multer 모듈
const router = express.Router();
const storage = multer.memoryStorage();  // 파일을 메모리에 저장하는 storage 설정
const upload = multer({ storage: storage });  // multer 설정

// 게시물 수정 페이지 렌더링
router.get("/edit/:id", function (req, res) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }

    // 게시물 ID를 ObjectId로 변환
    let postId = new ObjectId(req.params.id);
    let mydb = req.app.get('mydb');

    // MongoDB에서 해당 ID의 게시물 조회
    mydb.collection('post').findOne({ _id: postId })
        .then(result => {
            console.log(result);
            // 수정 페이지 렌더링 및 조회된 데이터 전달
            res.render('edit.ejs', { data: result });
        }).catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

// 게시물 수정 처리
router.post('/edit', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), function (req, res) {
    console.log(req.session.user);
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.files); 

    // 게시물 ID를 ObjectId로 변환
    let postId = new ObjectId(req.body.id);
    let mydb = req.app.get('mydb');

    let documentContent = '';
    const documentFiles = req.files.document;
    // 업로드된 문서 파일이 있는 경우 내용을 문자열로 변환
    if (documentFiles && documentFiles.length > 0) {
        const documentFile = documentFiles[0];
        documentContent = documentFile.buffer.toString('utf-8');
    }

    let imageData = null;
    // 업로드된 이미지 파일이 있는 경우 데이터를 저장
    if (req.files.image && req.files.image.length > 0) {
        const imageFile = req.files.image[0];
        imageData = imageFile.buffer;
    }

    // MongoDB에서 게시물 업데이트
    mydb.collection('post').updateOne(
        { _id: postId },
        {
            $set: {
                title: req.body.title,
                content: req.body.content + '\n\n' + documentContent,
                date: req.body.someDate,
                image: imageData
            }
        }
    ).then(result => {
        console.log('Data update successful');
        // 수정 완료 후 사용자 블로그 페이지로 리다이렉트
        res.redirect('/userblog');
    }).catch(err => {
        console.error(err);
        res.status(500).send('Data update failed');
    });
});

// 라우터 모듈 내보내기
module.exports = router;