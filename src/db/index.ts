import { Pool } from 'pg'
import pg from 'pg'

export let pool: Pool

export async function ConnectDB() {
  pool = new pg.Pool({
    connectionString: process.env.DSN,
    connectionTimeoutMillis: 5000
  })
}
