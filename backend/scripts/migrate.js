// Applies database/schema.sql to the database pointed to by DATABASE_URL.
// Idempotent: schema.sql uses CREATE TABLE/INDEX IF NOT EXISTS, so running
// this repeatedly is safe. Run with `npm run db:migrate` from the repo root
// or from backend/.
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const pool = require('../config/db')

const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql')

async function migrate() {
  const sql = fs.readFileSync(schemaPath, 'utf8')
  console.log(`Applying schema from ${schemaPath} ...`)
  await pool.query(sql)
  console.log('✅ Migration complete')
}

migrate()
  .catch((err) => {
    console.error('❌ Migration failed:', err.message)
    process.exitCode = 1
  })
  .finally(() => pool.end())
