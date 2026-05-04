const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/earth_smart',
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

module.exports = pool
