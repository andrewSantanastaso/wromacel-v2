import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Supports either a single DATABASE_URL (most hosts) or discrete vars.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Many managed Postgres hosts require SSL. Toggle with PGSSL=true.
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'romansh',
    });

pool.on('error', (err) => {
  console.error('Unexpected Postgres pool error:', err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
