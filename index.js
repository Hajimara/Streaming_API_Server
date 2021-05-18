// global
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

// local
import router from './routes';
import connect from './schemas';
import ws from './webSocket';

dotenv.config();

const app = express();

app.use('/', express.static(path.join((__dirname, 'public'))));
app.use('/websocket', express.static(path.join((__dirname, 'public/websocket.html'))));

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
