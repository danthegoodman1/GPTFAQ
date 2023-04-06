import { RowsNotFound } from "./errors.js"
import { pool } from "./index.js"

export interface Project {
  id: string
  domain: string
  company_name: string
  user_id: string
  name: string
  created_at: Date
  updated_at: Date
  selector: string | null
}

export async function insertProject(project: Omit<Project, "cerated_at" | "updated_at">) {
  const query = `
    INSERT INTO projects
      (id, domain, company_name, user_id, name, selector)
    VALUES
      ($1, $2, $3, $4, $5, $6)
  `

  const values = [
    project.id,
    project.domain,
    project.company_name,
    project.user_id,
    project.name,
    project.selector
  ]

  await pool.query(query, values)
}

export async function selectProject(id: string): Promise<Project> {
  const query = `
    SELECT *
    FROM projects
    WHERE id = $1
  `

  const { rows } = await pool.query<Project>(query, [id])

  if (rows.length > 0) {
    return rows[0] as Project
  } else {
    throw new RowsNotFound("projects")
  }
}
