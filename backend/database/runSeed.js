// backend/database/runSeed.js
// Node.js seed runner — reads schema.sql and seed.sql and executes them.
// Usage: node database/runSeed.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const SEED_FILE   = path.join(__dirname, 'seed.sql');

async function run() {
  let connection;
  try {
    // Connect without specifying a database first (so we can CREATE it)
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '3306', 10),
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,   // required to run .sql files with multiple statements
    });

    console.log('✅  Connected to MySQL');

    // ── Schema ──────────────────────────────────────────────────────────────
    console.log('📐  Applying schema...');
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
    await connection.query(schema);
    console.log('✅  Schema applied');

    // ── Seed ────────────────────────────────────────────────────────────────
    console.log('🌱  Seeding destinations...');
    const seed = fs.readFileSync(SEED_FILE, 'utf8');
    await connection.query(seed);
    console.log('✅  Seed data inserted (INSERT IGNORE — duplicates skipped)');

    // ── Report ───────────────────────────────────────────────────────────────
    await connection.query('USE triptastic');
    const [rows] = await connection.query('SELECT COUNT(*) AS total FROM destinations');
    console.log(`📊  destinations table now has ${rows[0].total} rows`);

    console.log('\n🎉  Database setup complete! You can now start the backend.\n');
  } catch (err) {
    console.error('\n❌  Seed failed:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

run();
