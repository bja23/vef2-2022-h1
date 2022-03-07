import pg from 'pg';
import dotenv from 'dotenv';

import { toPositiveNumberOrDefault } from './../utils/toPositiveNumberOrDefault.js';    

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

  export async function pagedQuery(sqlQuery, offset, limit) {
    const sqlLimit = values.length + 1;
    const sqlOffset = values.length + 2;
    const q = `${sqlQuery} LIMIT $${sqlLimit} OFFSET $${sqlOffset}`;
  
    const limitAsNumber = toPositiveNumberOrDefault(limit, 10);
    const offsetAsNumber = toPositiveNumberOrDefault(offset, 0);
  
    const combinedValues = values.concat([limitAsNumber, offsetAsNumber]);
  
    const result = await query(q, combinedValues);
  
    return {
      limit: limitAsNumber,
      offset: offsetAsNumber,
      items: result.rows,
    };
  }
  
  export async function findAllProducts(offset, limit) {
    const q = 'SELECT * FROM vorur ORDER BY "created" DESC LIMIT $1 OFFSET $2';
    const values = [limit, offset];
    const limitAsNumber = toPositiveNumberOrDefault(limit, 10);
    const offsetAsNumber = toPositiveNumberOrDefault(offset, 0);
  
    try {
        const result = await query(q,values);
        return {
            limit: limitAsNumber,
            offset: offsetAsNumber,
            products: result.rows,
          };

    } catch (e) {
      console.error('gat ekki fundið vörur');
      return false;
    }
  }

  export async function addProduct(title, price, description, image, flokkurID) {
    const q = `INSERT INTO vorur(title, price, description, image, "flokkurID")
              VALUES($1, $2, $3, $4, $5)`;
    const values = [title, price, description, image, flokkurID];
  
    try {
        const result = await query(q,values);
        return true;
    } catch (e) {
      console.error('gat ekki sett inn voru');
      return false;
    }
  }

    
  export async function findProductsByID(id) {
    const q = 'SELECT * FROM vorur WHERE id = $1';
    const values = [id];
  
    try {
        const result = await query(q,values);
        console.log(result.rows === [{}]);
        return {
            product: result.rows
          };

    } catch (e) {
      console.error('gat ekki fundið vöru');
      return false;
    }
  }

  export async function updateProductsByID(id, title) {
    const q = 'UPDATE vorur SET title = $1 WHERE id = $2';
    const values = [title, id];
  
    try {
        const result = await query(q,values);
        return true;

    } catch (e) {
      console.error('gat ekki uppfært vöru');
      return false;
    }
  }

  export async function deleteProductsByID(id) {
    const q = 'DELETE FROM vorur WHERE id = $1';
    const values = [id];
  
    try {
        const result = await query(q,values);
        return true;

    } catch (e) {
      console.error('gat ekki eytt vöru');
      return false;
    }
  }
  
  export async function findFlokkar(offset, limit) {
    const q = 'SELECT * FROM flokkur LIMIT $1 OFFSET $2';
    const values = [limit, offset];
    const limitAsNumber = toPositiveNumberOrDefault(limit, 10);
    const offsetAsNumber = toPositiveNumberOrDefault(offset, 0);
  
    try {
        const result = await query(q,values);
        return {
            limit: limitAsNumber,
            offset: offsetAsNumber,
            products: result.rows,
          };

    } catch (e) {
      console.error('gat ekki fundið flokka');
      return false;
    }
  }
  
  export async function addFlokkur(title) {
    const q = `INSERT INTO flokkur(title) VALUES($1)`;
    const values = [title];
  
    try {
        const result = await query(q,values);
        return true;
    } catch (e) {
      console.error('gat ekki sett inn voru');
      return false;
    }
  }

  export async function updateFlokkurByID(id, title) {
    const q = `UPDATE flokkur set title = $2 WHERE id = $1`;
    const values = [id, title];
  
    try {
        const result = await query(q,values);
        return true;
    } catch (e) {
      console.error('gat ekki sett inn voru');
      return false;
    }
  }

  export async function deleteFlokkurByID(id) {
    const q = `DELETE from flokkur WHERE id = $1`;
    const values = [id];
  
    try {
        const result = await query(q,values);
        return true;
    } catch (e) {
      console.error('gat ekki sett inn voru');
      return false;
    }
  }