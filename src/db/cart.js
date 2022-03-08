import { uuid } from 'uuidv4';
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

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


  
  export async function createCart() {
      const number = uuid();
    const q = 'INSERT INTO karfa (id) VALUES ($1)';
    const values = [number];
  
    try {
        const result = await query(q, values);
        return number;
    } catch (e) {
      console.error('Gat ekki fundið notanda eftir notendnafni');
      return null;
    }
    return false;
  }

  export async function getLinesInCart(cartID) {
  const q = 'SELECT * FROM linaIKorfu WHERE "karfaID" = $1';
  const values = [cartID];

  try {
      const result = await query(q, values);
      if(result.rowCount > 0){
        return result;
      }
  } catch (e) {
    console.error('gat ekki fundið linur');
    return false;
  }
  return false;
}

export async function addLineInCart(cartID, varaID, fjoldi) {
  const q = `INSERT INTO linaIKorfu ("varaID", "karfaID", fjoldi)
              VALUES($1, $2, $3)`;
  const values = [varaID, cartID, fjoldi];

  try {
      const result = await query(q, values);
      return true;
  } catch (e) {
    console.error('gat ekki sett inn linu');
    return false;
  }
  return false;
}

export async function getVaraById(id) {
  const q = 'SELECT * from vorur WHERE id = $1';
  const values = [id];

  try {
      const result = await query(q, values);
      if(result.rowCount >0){
        return result.rows;
      }
  } catch (e) {
    console.error('gat ekki sett inn linu');
    return false;
  }
  return false;
}

export async function deletecartById(id) {
  const q = 'DELETE FROM karfa WHERE id = $1';
  const values = [id];

  try {
      const result = await query(q, values);
      if(result.rowCount >0){
        return result.rows;
      }
  } catch (e) {
    console.error('gat ekki eytt korfu');
    return false;
  }
  return false;
}

export async function updateLineInCart(CartID, id, fjoldi) {
  const q = 'UPDATE linaIKorfu SET fjoldi = $1 WHERE "karfaID" = $3 AND "varaID" = $2';
  const values = [fjoldi, id, CartID];

  try {
      const result = await query(q, values);
      if(result.rowCount >0){
        return result.rows;
      }
  } catch (e) {
    console.error('gat ekki breytt fjolda');
    return false;
  }
  return false;
}

export async function deleteLineInCart(CartID, id) {
  const q = 'DELETE FROM linaIKorfu WHERE "karfaID" = $2 AND "varaID" = $1';
  const values = [id, CartID];

  try {
      const result = await query(q, values);
      if(result.rowCount >0){
        return result.rows;
      }
  } catch (e) {
    console.error('gat ekki breytt fjolda');
    return false;
  }
  return false;
}