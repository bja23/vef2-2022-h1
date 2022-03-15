import { uuid } from 'uuidv4';
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

import { toPositiveNumberOrDefault } from './../utils/toPositiveNumberOrDefault.js';    

dotenv.config();

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(q, values = []) {
    const client = await pool.connect();
  
    let result;
  
    try {
      result = await client.query(q, values);
    } catch (err) {
      console.error('Villa í query', err);
      throw err;
    } finally {
      client.release();
    }
  
    return result;
  }


  
  export async function getPantanir(offset, limit) {
        const q = 'SELECT * FROM pontun ORDER BY "created" DESC LIMIT $1 OFFSET $2';
        const values = [limit, offset];
        const limitAsNumber = toPositiveNumberOrDefault(limit, 10);
        const offsetAsNumber = toPositiveNumberOrDefault(offset, 0);
      
        try {
            const result = await query(q,values);
            if(result.rowCount >0){
                return {
                    limit: limitAsNumber,
                    offset: offsetAsNumber,
                    pantanir: result.rows,
                };
            }
    
        } catch (e) {
          console.error('gat ekki fundið vörur');
          return false;
        }
        return false;
      }

      export async function addPontun(name) {
        const uuidNumber = uuid();
        console.log(uuidNumber);
        const q = 'INSERT INTO pontun(id, name) VALUES($1, $2)';
        const values = [uuidNumber, name];
      
        try {
            const result = await query(q,values);
            if(result.rowCount > 0){
                return uuidNumber;
            }
        } catch (e) {
          console.error('gat ekki sett inn pontun');
          return false;
        }
        return false;
      }

      export async function addStateToPontun(id) {
        const q = 'INSERT INTO stodurPantana("pontunID", state ) VALUES($1,$2)';
        const values = [id, 'NEW'];
      
        try {
            const result = await query(q,values);
            console.log(result);
            if(result.rowCount > 0){
                return {msg:'NEW'};
        }
    } catch (e) {
    console.error('gat ekki sett inn pontun');
    return false;
  }
        return false;
      }

      export async function getPontun(id) {
        const q = 'SELECT * FROM pontun WHERE id = $1';
        const values = [id];
      
        try {
            const result = await query(q,values);
            console.log(result);
            if(result.rowCount > 0){
                return result;
        }
    } catch (e) {
    console.error('gat ekki sett inn pontun');
    return false;
  }
        return false;
      }

      export async function getPontunStada(id) {
        const q = 'SELECT * FROM stodurPantana WHERE "pontunID" = $1';
        const values = [id];
      
        try {
            const result = await query(q,values);
            if(result.rowCount > 0){
                return result;
        }
    } catch (e) {
    console.error('gat ekki sett inn pontun');
    return false;
  }
        return false;
      }

export async function updatePontunStada(id, state) {
  const q = 'UPDATE stodurPantana SET state = $2 WHERE "pontunID" = $1';
  const values = [id, state];
      
  try {
    const result = await query(q,values);
    if(result.rowCount > 0){
      return result;
    }
  } catch (e) {
    console.error('gat ekki sett inn pontun');
    return false;
  }
  return false;
}
     