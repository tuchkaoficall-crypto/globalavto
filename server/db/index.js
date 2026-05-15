const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST === 'localhost' ? '127.0.0.1' : (process.env.DB_HOST || '127.0.0.1'),
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'globalavto',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
})

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
})

module.exports = pool
