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

  export async function comparePasswords(password, hash) {
    const result = await bcrypt.compare(password, hash);
  
    return result;
  }
  
  export async function findByUsername(username) {
    const q = 'SELECT * FROM users WHERE username = $1';
  
    try {
      const result = await query(q, [username]);
  
      if (result.rowCount === 1) {
        return result.rows[0];
      }
    } catch (e) {
      console.error('Gat ekki fundið notanda eftir notendnafni');
      return null;
    }
  
    return false;
  }
  export async function findByEmail(email) {
    const q = 'SELECT * FROM users WHERE email = $1';
  
    try {
      const result = await query(q, [email]);
  
      if (result.rowCount === 1) {
        return result.rows[0];
      }
    } catch (e) {
      console.error('Gat ekki fundið notanda eftir emaili');
      return null;
    }
  
    return false;
  }
  
  // Check if user is Admin
  export async function isAdmin(username) {
      const q = 'SELECT isAdmin FROM users WHERE username = $1';
    
      try {
        const result = await query(q, [username]);
    
        if (result.rowCount === 1) {
          return result.rows[0];
        }
      } catch (e) {
        console.error('Gat ekki fundið notanda eftir notendnafni');
        return null;
      }
    
      return false;
    }
  
    // Check for all users in users table
  export async function findAllUsers() {
      const q = 'SELECT username FROM users';
    
      try {
        const result = await query(q);
        return result.rows;
      } catch (e) {
        console.error('Gat ekki fundið notanda eftir notendnafni');
        return null;
      }
    }
  
  
  
  export async function findById(id) {
    const q = 'SELECT * FROM users WHERE id = $1';
  
    try {
      const result = await query(q, [id]);
  
      if (result.rowCount === 1) {
        return result.rows[0];
      }
    } catch (e) {
      console.error('Gat ekki fundið notanda eftir id');
    }
  
    return null;
  }
  
  
  export async function createUser(name,username,email,password) {
      const q = `INSERT INTO users (name,username,email,password )
      VALUES($1, $2,$3, $4)`;
      const values = [name, username,email, password];
      try {
        const result = await query(q, values);
        if(result){
            return true;
        }
      } catch (e) {
        console.error('error inserting into user');
        return false;
      }
    
      return null;
    }

    export async function changeUserAdminRight(id, admin) {
      const q = 'UPDATE users SET isAdmin = $2 WHERE id=$1';
      const values = [id, admin];
      try {
        const result = await query(q, values);
        if(result){
            return true;
        }
      } catch (e) {
        console.error('error inserting into user');
        return false;
      }
    
      return null;
    }

    export async function changeUserEmail(id, email) {
      const q = 'UPDATE users SET email = $2 WHERE id=$1';
      const values = [id, email];
      try {
        const result = await query(q, values);
        if(result){
            return true;
        }
      } catch (e) {
        console.error('error inserting into user');
        return false;
      }
    
      return null;
    }

    export async function changeUserPassword(id, password) {
      const q = 'UPDATE users SET password = $2 WHERE id=$1';
      const values = [id, password];
      try {
        const result = await query(q, values);
        if(result){
            return true;
        }
      } catch (e) {
        console.error('error inserting into user');
        return false;
      }
    
      return null;
    }
    
