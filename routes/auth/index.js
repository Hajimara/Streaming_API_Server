import express from 'express';
import * as authCtrl from './auth.ctrl';
import jwtVerify from '../middlewares/jwtVerify';

const auth = express.Router();

auth.post('/login', authCtrl.login);
auth.post('/register', authCtrl.register);
auth.get('/findUser', jwtVerify, authCtrl.findUser);

export default auth;
