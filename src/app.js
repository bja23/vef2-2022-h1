import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { uuid } from 'uuidv4';
import fetch from 'node-fetch';

import { router as userRouter } from './api/users.js';
import { router as menuRouter } from './api/menu.js';
import { router as catRouter } from './api/category.js';
import { router as cartRouter } from './api/cart.js';
import { router as ordersRouter } from './api/orders.js';

import {
  findById
} from './db/users.js';

import {
  getPontunStada,
  getPantanir,
} from './db/orders.js'

dotenv.config();

const {
  HOST: hostname = '127.0.0.1',
  PORT: port = 3000,
  JWT_SECRET: jwtSecret = "$dk3Ae9dknv#Gposiuhvkjkljd",
  TOKEN_LIFETIME: tokenLifetime = 20000,
  DATABASE_URL: databaseUrl,
} = process.env;


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


  const server = app.listen(3000, () => {
    console.info('Server running at http://localhost:3000/');
  });
  
  const wss = new WebSocketServer({ server });
  
  wss.on('connection',  (ws) => {
    ws.on('close', () => console.log('Client disconnected'));
  
    ws.on('message',async (data) => {
      const myData = JSON.parse(data);
      const stada = await getPontunStada(myData.id);

      if(stada !== false){
        let oldStada = stada.rows[0].state;
        ws.send(`echo: ${JSON.stringify(stada.rows[0].state)}`);
        const tenging = setInterval(async () => {
          const stada2 = await getPontunStada(myData.id);
          if(stada2.rows[0].state !== oldStada){
            if(stada2.rows[0].state === 'FINISHED'){
              ws.send(`echo: ${JSON.stringify(stada2.rows[0].state), ' closed connections'}`);
              clearInterval(tenging);
            }
            ws.send(`echo: ${JSON.stringify(stada2.rows[0].state)}`);
            oldStada = stada2.rows[0].state;
          }
        }, 5000);
      }

      const url = 'http://localhost:7777' + '/users/isTokenLegal/'; // eslint-disable-line prefer-template
      const options = { headers: {} };
      options.method = 'GET';
      options.headers['content-type'] = 'application/json';
      options.headers.Authorization = `Bearer ${myData.token}`;
  
      const res = await fetch(url, options);
      const json = await res.json();
      if(json.login){
        const tenging = setInterval(async () => {
          const p = await getPantanir(0,10);
          ws.send(`echo: ${JSON.stringify(p)}`);
        }, 5000);
      }

    });
  });
  

app.use('/users/', userRouter);
app.use('/menu', menuRouter);
app.use('/categories', catRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);

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