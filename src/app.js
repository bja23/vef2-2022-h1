import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { router as userRouter } from './api/users.js';
import { router as menuRouter } from './api/menu.js';
import { router as catRouter } from './api/category.js';
import { router as cartRouter } from './api/cart.js';

import {
  findById
} from './db/users.js';

dotenv.config();

const {
  HOST: hostname = '127.0.0.1',
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 20000,
  DATABASE_URL: databaseUrl,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

if (!jwtSecret || !databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

const app = express();

app.use(express.json());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  // fáum id gegnum data sem geymt er í token
  const user = await findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({
      menu: '/menu',
      catagories: '/catagories',
      orders: '/orders',
      users: '/users/',
      register: '/users/register',
      login: '/users/login',
    });
  });

app.use('/users/', userRouter);
app.use('/menu', menuRouter);
app.use('/categories', catRouter);
app.use('/cart', cartRouter);

app.use((req, res) => {
    console.warn('Not found', req.originalUrl);
    res.status(404).json({ error: 'Not found' });
  });
  
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // Grípum illa formað JSON og sendum 400 villu til notanda
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ error: 'Invalid json' });
    }
  
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  });
  
  app.listen(port, () => {
     // eslint-disable-next-line prefer-template
    console.info('Server running at http://' + hostname + ':' + port + '/');
  });