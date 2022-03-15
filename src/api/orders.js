import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { 
  getPantanir,
  addPontun,
  addStateToPontun,
  getPontun,
  getPontunStada,
  updatePontunStada,
 } from '../db/orders.js';

import {
    isAdmin,
} from '../db/users.js';




dotenv.config();

const { 
    DATABASE_URL: connectionString,
    NODE_ENV: nodeEnv = 'development',
    JWT_SECRET: jwtSecret,
    TOKEN_LIFETIME: tokenLifetime = 20000,
} =process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

export const router = express.Router();

router.use(express.json());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};


function requireAuthentication(req, res, next) {
    return passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        const error =
          info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
  
        return res.status(401).json({ error });
      }
  
      // Látum notanda vera aðgengilegan í rest af middlewares
      req.user = user;
      return next();
    })(req, res, next);
  }

router.get('', requireAuthentication, async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const user = req.user.username;
  const admin = await isAdmin(user);
  if(admin){
    const pantanir = await getPantanir(offset, limit);
    if(pantanir){
      return res.status(200).json(pantanir);
    }
    return res.status(400).json({error: "no orders to show"});
  }
  return res.status(401).json({error: "User is not admin"});
});

router.post('', requireAuthentication, async (req, res) => {
  const { name } = req.body;
  const uuidNumber = await addPontun(name);
  if(!uuidNumber){
    return res.status().json({error:"did not created pontun"});
  }
  console.log(uuidNumber);
  const state = await addStateToPontun(uuidNumber);
  console.log(state);
  if(!state){
    return res.status(400).json({error:"did not created pontun"});
  }
  return res.status(200).json({pontunID: uuidNumber, stada: state.msg});
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const lines = await getLinesInCart(cartID);
  let sum = 0;

  for(let i = 0; i < lines.rowCount; i++){
    const fjoldi = lines.rows[i].fjoldi;
    const price = await getVaraById(lines.rows[i].varaID);
    sum += (fjoldi * price[0].price);
    i++;
  }
  if(cartID !== false) {
     return res.status(200).json({linur: lines.rows, heildarverd: sum});
  }
  return res.status(400).json({error: "could not get lines from cart"});
});

router.get('/:id/status', async (req, res) => {
  const { id } = req.params;

  const pontun = await getPontun(id);
  const stata = await getPontunStada(id);

  if(!pontun || !stata){
    return res.status(400).json({error: "could not get pöntun"});
  }

  return res.status(200).json({pontun: pontun, stada: stata});
});

router.post('/:id/status',requireAuthentication, async (req, res) => {
  const { id } = req.body;
  const admin = await isAdmin(req.user.username);
  if(admin.isadmin){
    const stata = await getPontunStada(id);
    if(stata !== false){
      let thisState;
      if(stata.rows[0].state == 'NEW'){
        thisState = await updatePontunStada(id, 'PREPARE');
        if(thisState !== false){
          return res.status(200).json({msg: "updated state"});
        }
      }
      else if(stata.rows[0].state === 'PREPARE'){
        thisState = await updatePontunStada(id, 'COOKING');
        if(thisState !== false){
          return res.status(200).json({msg: "updated state"});
        }
      }
      else if(stata.rows[0].state === 'COOKING'){
        thisState = await updatePontunStada(id, 'READY');
        if(thisState !== false){
          return res.status(200).json({msg: "updated state"});
        }
      }
      else if(stata.rows[0].state === 'READY'){
        thisState = await updatePontunStada(id, 'FINISHED');
        if(thisState !== false){
          return res.status(200).json({msg: "updated state"});
        }
      }
      console.log("komst hingap");
      return res.status(400).json({error: "could not update state"});
    }
    return res.status(400).json({error: "could not update state"});
  }
  return res.status(401).json({error: "User is not admin"});
});
