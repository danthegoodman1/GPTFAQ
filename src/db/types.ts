export interface User {
  id: string
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: string
  domain: string
  user_id: string
  name: string
  created_at: Date
  updated_at: Date
}

export interface GeneratedSchema {
  id: string
  user_id: string
  project_id: string
  created_at: Date
  updated_at: Date
}
