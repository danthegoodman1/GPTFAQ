import { pool } from "./index.js"

export interface GeneratedFAQ {
  id: string
  user_id: string
  project_id: string
  content: string
  expires: Date
  created_at: Date
  updated_at: Date
}

export async function upsertGeneratedFAQ(data: Omit<GeneratedFAQ, 'created_at' | 'updated_at'>): Promise<void> {
  const query = `INSERT INTO generated_faqs (id, user_id, project_id, content, expires) VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (project_id, id) DO UPDATE
  set content = excluded.content, updated_at = now(), expires = excluded.expires
  `
  await pool.query(query, [data.id, data.user_id, data.project_id, data.content, data.expires])
}

export async function selectGeneratedFAQ(projectID: string, id: string): Promise<GeneratedFAQ | null> {
  const query = `SELECT * FROM generated_faqs WHERE project_id = $1 and id = $2`
  const result = await pool.query(query, [projectID, id])

  return result.rows.length > 0 ? result.rows[0] : null
}
