create table if not exists users (
  id text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key(id)
);

create table if not exists projects (
  id text not null,
  domain text not null,
  company_name text not null,
  user_id text not null references users(id) on set null
  name text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key(id)
);
create index if not exists projects_by_user on projects(user_id)

create table if not exists generated_schemas (
  id text not null,
  user_id text not null,
  project_id text not null,
  foreign key (user_id, project_id) references projects(user_id, id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key(project_id, id)
);
-- create index if not exists generated_schemas_by_user_id ON generated_schemas(user_id);

create table if not exists project_content (
  id text not null,
  user_id text not null,
  project_id text not null,
  foreign key (user_id, project_id) references projects(user_id, id) on delete set null,
  content text not null,
  format text not null, -- 'text' | 'markdown' | 'html'

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key(project_id, id)
);
