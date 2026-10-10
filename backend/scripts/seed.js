// Loads sample data from database/seed.sql into the database pointed to by
// DATABASE_URL. Skips if the database already has users, so it is safe to run
// more than once without creating duplicate rows. Run with `npm run db:seed`.
// Run `npm run db:migrate` first so the tables exist.
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const pool = require('../config/db')

const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql')

async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM users')
  if (rows[0].count > 0) {
    console.log('ℹ️  Database already has data; skipping seed.')
    return
  }

  const sql = fs.readFileSync(seedPath, 'utf8')
  console.log(`Seeding from ${seedPath} ...`)
  await pool.query(sql)
  console.log('✅ Seed complete')
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err.message)
    process.exitCode = 1
  })
  .finally(() => pool.end())
