import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse DATABASE_URL from environment
let dbPath = process.env.DATABASE_URL || 'database/navguide.db';
if (dbPath.startsWith('sqlite:///')) {
  dbPath = dbPath.replace('sqlite:///', '');
}

// Resolve relative to project root
const projectRoot = path.resolve(__dirname, '../../');
const resolvedDbPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(projectRoot, dbPath);

// Ensure the parent directory of the database exists
const dbDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db = null;

export async function getDb() {
  if (db) return db;
  
  db = await open({
    filename: resolvedDbPath,
    driver: sqlite3.Database
  });
  
  return db;
}

export async function initDb() {
  const database = await getDb();
  
  console.log(`[DB] Connected to SQLite database at: ${resolvedDbPath}`);
  
  // Read and execute schema.sql
  const schemaPath = path.resolve(projectRoot, 'database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await database.exec(schemaSql);
    console.log('[DB] Database schema verified/initialized.');
  } else {
    console.warn('[DB] Warning: database/schema.sql not found!');
  }
  
  // Seed colleges if empty
  try {
    const collegeCount = await database.get('SELECT COUNT(*) as count FROM engineering_colleges');
    if (collegeCount && collegeCount.count === 0) {
      const seedPath = path.resolve(projectRoot, 'database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await database.exec(seedSql);
        console.log('[DB] Database seeded with engineering colleges.');
      } else {
        console.warn('[DB] Warning: database/seed.sql not found!');
      }
    } else {
      console.log('[DB] Colleges table already seeded.');
    }
  } catch (error) {
    console.error('[DB] Error during seeding:', error.message);
  }
  
  return database;
}
