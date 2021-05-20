// global
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
// local
import router from './routes';
import connect from './schemas';
import ws from './webSocket';

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join((__dirname, 'views'))));
// app.use('/websocket', express.static(path.join((__dirname, 'public/websocket.html'))));
app.get('/view/:fileName', (req, res) => {
  const { fileName } = req.params;

  res.render('video', {
    title: fileName,
    videoSource: `/videos/${fileName}`,
  });
});

app.use('/videos/:fileName', ((req, res) => {
  const { fileName } = req.params;
  const fullPath = path.join(__dirname, `videos/${fileName}`);
  if (!fs.existsSync(fullPath)) return res.writeHead(500).end();
  const fileStat = fs.statSync(fullPath);
  const { size } = fileStat;
  const { range } = req.headers;
  // 범위에 대한 요청이 있을 경우
  if (range) {
    // bytes= 부분을 없애고 - 단위로 문자열을 자름
    const parts = range.replace(/bytes=/, '').split('-');
    // 시작 부분의 문자열을 정수형으로 변환
    // eslint-disable-next-line radix
    const start = parseInt(parts[0]);
    // 끝 부분의 문자열을 정수형으로 변환 (끝 부분이 없으면 총 파일 사이즈에서 - 1)
    // eslint-disable-next-line radix
    const end = parts[1] ? parseInt(parts[1]) : size - 1;
    // 내보낼 부분의 길이
    const chunk = end - start + 1;
    // 시작 부분과 끝 부분의 스트림을 읽음
    const stream = fs.createReadStream(fullPath, { start, end });
    // 응답
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunk,
      'Content-Type': 'video/mp4',
    });
    // 스트림을 내보냄
    stream.pipe(res);
  } else {
    // 범위에 대한 요청이 아님
    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': 'video/mp4',
    });
    // 스트림을 만들고 응답에 실어보냄
    fs.createReadStream(fullPath).pipe(res);
  }
}));

app.use(morgan('dev'));
// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

connect();

const server = app.listen(process.env.APIPORT || 3333, () => {
  console.log('APIServer IS RUNNING, TALKING TO API SERVER ON 3333');
});

ws(server);
