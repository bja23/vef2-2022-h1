import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import {
    findFlokkar,
    addFlokkur,
    updateFlokkurByID,
    deleteFlokkurByID,
} from './../db/menu.js';

import {
    isAdmin,
} from './../db/users.js';



dotenv.config();

const {
  HOST: hostname = '127.0.0.1',
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 20000,
  DATABASE_URL: databaseUrl,
} = process.env;

if (!jwtSecret || !databaseUrl) {
  console.error('Vantar cate.env gildi');
  process.exit(1);
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

router.get('', async (req, res) => {
    const { offset = 0, limit = 10 } = req.query;
    const flokkar = await findFlokkar(offset, limit);
    if(flokkar === false) {
        res.status(400).json({error: "did not find flokkar"});
    }
    res.status(200).json(flokkar);
});

const validationPatch = [
    body('title')
      .isLength({ min: 1, max: 64 })
      .withMessage('titill má ekki vera tómur'),
  ];

  const validationRegister = async (req, res, next) => {
    const result = validationResult(req);
  
    if (!result.isEmpty()) {
      return res.json(result);
    }
  
    return next();
  };

  const sanitazion = [
    body('title').trim().escape(),
    body('price').trim().escape(),
    body('description').trim().escape(),
    body('image').trim().escape(),
    body('flokkurID').trim().escape(),
    body('title').customSanitizer((value) => xss(value)),
    body('price').customSanitizer((value) => xss(value)),
    body('description').customSanitizer((value) => xss(value)),
    body('image').customSanitizer((value) => xss(value)),
    body('flokkurID').customSanitizer((value) => xss(value)),
  ];


router.post('',requireAuthentication, validationPatch, validationRegister, sanitazion, async (req, res) => {
    const {title } = req.body;
    const isadmin = await isAdmin(req.user.username);
    if(isadmin.isadmin){
        const flokkar = await addFlokkur(title);
        if(flokkar === false){
            return res.status(400).json({error: "did not create flokkur"});
        }
        return res.status(200).json(flokkar);
    }
    return res.status(401).json({error: "user does not has license"});
});

router.patch('/:id',requireAuthentication, validationPatch, validationRegister, sanitazion, async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const isadmin = await isAdmin(req.user.username);
    if(isadmin.isadmin){
        const flokkar = await updateFlokkurByID(id, title);
        if(flokkar === false){
            return res.status(400).json({error: "did not update flokkur"});
        }
        return res.status(200).json({messages: "complete"});
    }
    return res.status(401).json({error: "user does not has license"});
});

router.delete('/:id',requireAuthentication, async (req, res) => {
    const { id } = req.params;
    const isadmin = await isAdmin(req.user.username);
    if(isadmin.isadmin){
        const flokkar = await deleteFlokkurByID(id);
        if(flokkar === false){
            return res.status(400).json({error: "did not delete flokkur"});
        }
        return res.status(200).json({messages: "delete complete"});
    }
    return res.status(401).json({error: "user does not has license"});
});
