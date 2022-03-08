import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import {
    createCart,
    getLinesInCart,
    addLineInCart,
    getVaraById,
    deletecartById,
    updateLineInCart,
    deleteLineInCart,
} from './../db/cart.js';

import {
    isAdmin,
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

router.post('', async (req, res) => {
    
    const cartID = await createCart();
    if(cartID !== false) {
       return res.status(200).json({cartID: cartID});
    }
    return res.status(400).json({error: "did not create cart"});
});

router.get('/:cartID', async (req, res) => {
  const { cartID } = req.params;
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

router.post('/:cartID', async (req, res) => {
  const { cartID } = req.params;
  const { varaID, fjoldi } = req.body;
  console.log(varaID, fjoldi);

  const lines = await addLineInCart(cartID, varaID, fjoldi);
    
  if(lines !== false) {
     return res.status(200).json({msg:"true"});
  }
  return res.status(400).json({error: "did not create cart"});
});

router.delete('/:cartID', async (req, res) => {
  const { cartID } = req.params;
  const cart = await deletecartById(cartID);
    
  if(cart !== false) {
     return res.status(200).json({msg:"true"});
  }
  return res.status(400).json({error: "did not delete cart"});
});

router.get('/:cartID/line/:id', async (req, res) => {
  const { cartID, id } = req.params;
  console.log(cartID, id);
  const lines = await getLinesInCart(cartID);
  let sum = 0;

  const fjoldi = lines.rows[id].fjoldi;
  console.log(fjoldi);
  const price = await getVaraById(lines.rows[id].varaID);
  console.log(price);
  sum += (fjoldi * price[0].price);

  if(cartID !== false) {
     return res.status(200).json({upplysingar: price, "heildarverd linu ": sum});
  }
  return res.status(400).json({error: "could not get lines from cart"});
});

router.patch('/:cartID/line/:id', async (req, res) => {
  const { fjoldi } = req.body;
  const { cartID, id } = req.params;

  const update = updateLineInCart(cartID, id, fjoldi);

  if(update !== false) {
     return res.status(200).json({msg: "true"});
  }
  return res.status(400).json({error: "could not update line"});
});

router.delete('/:cartID/line/:id', async (req, res) => {
  const { cartID, id } = req.params;

  const deleteLine = deleteLineInCart(cartID, id);

  if(deleteLine !== false) {
     return res.status(200).json({msg: "true"});
  }
  return res.status(400).json({error: "could not delete line"});
});