import { Pool } from 'pg';
import 'dotenv/config';

async function check() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
        const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'User' AND column_name = 'refreshToken';
        `);
        console.log("Column 'refreshToken' exists:", res.rowCount > 0);
        
        if (res.rowCount === 0) {
            console.log("Attempting to add column manually...");
            await pool.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;');
            console.log("Column added successfully.");
        }
    } catch (err) {
        console.error("Error checking/adding column:", err);
    } finally {
        await pool.end();
    }
}

check();
