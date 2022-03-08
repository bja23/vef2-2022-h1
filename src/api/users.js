import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import {
    comparePasswords,
    findByUsername,
    findById,
    isAdmin,
    findAllUsers,
    createUser,
} from './../db/users.js';



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

router.post('/login', async (req, res) => {
    const { username, password = '' } = req.body;
    const user = await findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'No such user' });
    }
  
    const passwordIsCorrect = await comparePasswords(password, user.password);
  
    if (passwordIsCorrect) {
      const payload = { id: user.id };
      const tokenOptions = { expiresIn: tokenLifetime };
      const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
      return res.status(201).json({ token });
    }
  
    return res.status(401).json({ error: 'Invalid password' });
  });

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

router.get('/', requireAuthentication, async (req, res) => {
    // check if user is admin
    const isUserAdmin = await isAdmin(req.user.username);
    if (isUserAdmin.isadmin) {
      const all = await findAllUsers();
      return res.status(201).json(all);
    } 
  
    return res.status(400).json({ error: 'Notandi er ekki stjórnandi' });
    
  });

  const validation = [
    body('name')
      .isLength({ min: 1, max: 64 })
      .withMessage('Nafn má ekki vera tómt'),
    body('username')
      .isLength({ min: 1, max: 64 })
      .withMessage('username má ekki vera tómt'),
    body('password')
      .isLength({ min: 3, max: 254 })
      .withMessage(
        'password verður að vera 3 stafir eða lengra og ekki stærra en 254'
      ),
  ];

  const validationRegister = async (req, res, next) => {
    const result = validationResult(req);
  
    if (!result.isEmpty()) {
      return res.json(result);
    }
  
    return next();
  };

  const sanitazion = [
    body('name').trim().escape(),
    body('username').trim().escape(),
    body('name').customSanitizer((value) => xss(value)),
    body('username').customSanitizer((value) => xss(value)),
    body('password').customSanitizer((value) => xss(value)),
  ];

router.post(
    '/users/register',
    validation,
    validationRegister,
    sanitazion,
    async (req, res) => {
      const { name, username, password } = req.body;
      const pass = await bcrypt.hash(password, 10);
  
      const test = await createUser(name, username, pass);
      if (test) {
        // eslint-disable-next-line object-shorthand
        const myData = [{ userCreted: test, name: name, username: username }];
        return res.status(201).json(myData);
      }
  
      return res.status(400).json({ error: 'heppnaðist ekki' });
    }
  );
  
  router.get('/users/me', requireAuthentication, async (req, res) => {
    const myData = await findByUsername(req.user.username);
    const showData = [
      {
        id: myData.id,
        name: myData.name,
        username: myData.username,
        token: req.user.token,
      },
    ];
    return res.status(201).json(showData);
  });
  
  router.get('/users/', requireAuthentication, async (req, res) => {
    const myData = await findAllUsers();
    const myInfo = await findById(req.user.id);
    if (myInfo[0].isAdmin) {
      return res.status(201).json(myData);
    }
    return res.status(400).json({ error: 'not admin' });
  });
  
  router.get('/users/:id', requireAuthentication, async (req, res) => {
    const { id } = req.params;
    // check if user is admin
    const isUserAdmin = await isAdmin(req.user.username);
    if (isUserAdmin.isadmin) {
      const all = await findById(id);
      if (all != null) {
        const showData = [{ id: all.id, name: all.name, username: all.username }];
        return res.status(201).json(showData);
      }
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(400).json({ error: 'Notandi er ekki stjórnandi' });
  });
