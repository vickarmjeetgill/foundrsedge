import { Pool } from 'pg';
import 'dotenv/config';

async function check() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log("Tables in public schema:", res.rows.map(r => r.table_name));
        
        const columns = await pool.query(`
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_name ILIKE 'user';
        `);
        console.log("Columns for 'user' tables:", columns.rows);
    } catch (err) {
        console.error("Error checking tables:", err);
    } finally {
        await pool.end();
    }
}

check();
