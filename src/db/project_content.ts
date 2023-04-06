import { RowsNotFound } from "./errors.js"
import { pool } from "./index.js"

export interface ProjectContent {
  id: string
  user_id: string
  project_id: string
  content: string
  format: 'text' | 'markdown' | 'html'
  created_at: Date
  updated_at: Date
}

export async function insertProjectContent(pc: Omit<ProjectContent, "updated_at" | "created_at">) {
  const query = `
    INSERT INTO project_content
      (id, user_id, project_id, content, format)
    VALUES
      ($1, $2, $3, $4, $5)
    ON CONFLICT (project_id, id) DO UPDATE
    SET content = excluded.content, updated_at = NOW()
    `

  const values = [
    pc.id,
    pc.user_id,
    pc.project_id,
    pc.content,
    pc.format,
  ]

  await pool.query(query, values)
}

export async function getProjectContent(projectID: string, id: string): Promise<ProjectContent | null> {
  const q = await pool.query<ProjectContent>(`select * from project_content where project_id = $1 and id = $2`, [projectID, id])
  if (q.rowCount === 0) return null

  return q.rows[0]
}
