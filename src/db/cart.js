import { v4 as uuidv4 } from 'uuid';
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
      const number = v4();
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