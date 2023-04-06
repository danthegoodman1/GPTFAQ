import { pool } from "./index.js"

export interface GeneratedSchema {
  id: string
  user_id: string
  project_id: string
  created_at: Date
  updated_at: Date
}

export async function insertGeneratedSchema(data: Omit<GeneratedSchema, 'created_at' | 'updated_at'>): Promise<void> {
  const query = `INSERT INTO generated_schemas (id, user_id, project_id) VALUES ($1, $2, $3)`
  await pool.query(query, [data.id, data.user_id, data.project_id])
}

export async function selectGeneratedSchema(id: string): Promise<GeneratedSchema | null> {
  const query = `SELECT id, user_id, project_id, created_at, updated_at FROM generated_schemas WHERE id = $1`
  const result = await pool.query(query, [id])

  return result.rows.length > 0 ? result.rows[0] : null
}
