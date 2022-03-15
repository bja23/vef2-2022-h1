import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import {
    findAllProducts,
    addProduct,
    findProductsByID,
    updateProductsByID,
    deleteProductsByID,
    findFlokkByID,
} from './../db/menu.js';

import {
  isAdmin
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

router.get('/', async (req, res) => {
    const { offset = 0, limit = 10, category = false, search = false } = req.query;
    let catName = false;
    if(category !== false){
      const getID = await findFlokkByID(category);
      if(getID !== false){
        catName = getID.product[0].id;
      }
    }

    const prod = await findAllProducts(offset, limit, catName, search);
    if(!prod){
        return res.status(400).json({ error: 'Engar niðurstöður fundust eða leit klikkaði'});
    }
    return res.status(200).json(prod);
    
  });

  const validation = [
    body('title')
      .isLength({ min: 1, max: 64 })
      .withMessage('titill má ekki vera tómur'),
    body('price')
      .isLength({ min: 1, max: 64 })
      .withMessage('price má ekki vera tómt'),
    body('description')
      .isLength({ min: 1, max: 254 })
      .withMessage('má ekki vera tómt'),
    body('image')
      .isLength({ min: 1, max: 254 })
      .withMessage('má ekki vera tómt'),
    body('flokkurID')
      .isLength({ min: 1, max: 254 })
      .withMessage('má ekki vera tómt'),
  ];

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

router.post('/',requireAuthentication, validation, validationRegister,sanitazion, async (req, res) => {
  const { title, price, description, image, flokkurID } = req.body;
  const isadmin = await isAdmin(req.user.username);
  if(isadmin.isadmin){
    if(await addProduct(title, price, description, image, flokkurID)){
      return res.status(200).json({"complete":"true"});
    }
    return res.status(400).json({"error":"could not add product. title could already exist"});
  }
  return res.status(401).json({"error":"user is not admin"});
});

router.get('/:id', async (req, res) => {
  const { id: id} = req.params;
  const prod = await findProductsByID(id);
  if((prod === undefined) || (prod === false)){
    return res.status(400).json({error: "illeagal search"});
  }
  return res.status(200).json(prod);
});

router.patch('/:id',requireAuthentication,validationPatch, validationRegister,sanitazion, async (req, res) => {
  const { id: id} = req.params;
  const { title = ''} = req.body;
  const user = req.user.id;
  const admin = isAdmin(user);

  if(admin){
    if(title !== ''){
      const update = updateProductsByID(id, title);
      if(update){
        return res.status(200).json({message: "updated"});
      }
      return res.status(400).json({error: "did not update"});
    }
    return res.status(400).json({error: "title is missing"});
  }
  return res.status(401).json({error: "user is not admin"});
});

router.delete('/:id',requireAuthentication, async (req, res) => {
  const { id: id} = req.params;
  const user = req.user.id;
  const admin = isAdmin(user);

  if(admin){
    const update = updateProductsByID(id);
    if(update){
      return res.status(200).json({message: "deleted"});
    }
   return res.status(400).json({error: "did not delete"});
  }
  return res.status(401).json({error: "user is not admin"});
  });



