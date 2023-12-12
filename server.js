// Express 및 path 모듈 불러오기
const express = require('express');
const path = require('path');
const sha = require('sha256'); // 암호화 모듈
const session = require('express-session');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

// Express 애플리케이션 생성
const app = express();

// MongoDB 연결 정보 및 데이터베이스 설정
const url = 'mongodb+srv://youjin02080:1234@cluster0.vj0xmmo.mongodb.net/?retryWrites=true&w=majority';

// MongoDB에 연결하고 서버 실행
MongoClient
    .connect(url)
    .then((client) => {
        mydb = client.db("myboard");
        app.set('mydb', mydb);        
        app.listen(8080, function () {
            console.log("port 8080에서 서버 대기중...");
        });
    })
    .catch((err) => {
        console.log(err);
    });

// 세션 미들웨어 설정
app.use(session({
    secret: 'dasjidjasdj213df',
    resave: false,
    saveUninitialized: true,
}));

// 정적 파일 제공 설정
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/script', express.static(path.join(__dirname, 'script')));

// 라우터 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.engine('ejs', require('ejs').__express);
// 라우터 추가
const homeRouter = require('./routes/home');  // 홈 라우터
const indexRouter = require('./routes/index');  // 인덱스 라우터
const loginRouter = require('./routes/login');  // 로그인 라우터
const postRouter = require('./routes/post');  // 포스트 라우터
const signupRouter = require('./routes/signup');  // 회원가입 라우터
const editRouter = require('./routes/edit');  // 수정 라우터
const userblogRouter = require('./routes/userblog');  // 사용자 블로그 라우터
const addfriendRouter = require('./routes/addfriend');  // 친구 추가 라우터
const friendlistRouter = require('./routes/friendlist');  // 친구 목록 라우터
const friendpostRouter = require('./routes/friendpost');  // 친구 포스트 라우터
const recomfriendRouter = require('./routes/recomfriend');  // 추천 친구 라우터
const friendblogRouter = require('./routes/friendblog');  // 친구 블로그 라우터

app.use('/', homeRouter);
app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', postRouter);
app.use('/', signupRouter);
app.use('/', editRouter);
app.use('/', userblogRouter);
app.use('/', addfriendRouter);
app.use('/', friendlistRouter);
app.use('/', friendpostRouter);
app.use('/', recomfriendRouter);
app.use('/', friendblogRouter);


// 콘텐츠 라우터 설정
app.get("/content/:id", function (req, res) {
    console.log(req.params.id);
    let new_id = new ObjectId(req.params.id);

    // MongoDB에서 게시물 조회
    mydb.collection('post').findOne({ _id: new_id })
        .then(result => {
            console.log("Logged-in User:", req.session.user);
            console.log("Post Author:", result.userid);

            // 현재 로그인한 사용자와 게시물 작성자 비교
            if (req.session.user && result.userid === req.session.user.userid) {
                // 같으면 편집 버튼 표시
                res.render('content.ejs', { data: result, user: req.session.user, showEditButton: true });
            } else {
                // 다르면 편집 버튼 숨김
                res.render('content.ejs', { data: result, user: req.session.user, showEditButton: false });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send();
        });
});