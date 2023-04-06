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
  poke_token text not null,
  user_id text not null references users(id) on delete no action,
  name text not null,
  selector text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key(id)
);
create index if not exists projects_by_user on projects(user_id);

create table if not exists generated_faqs (
  id text not null,
  user_id text not null references users(id) on delete no action,
  project_id text not null references projects(id) on delete no action,
  content text not null,

  expires timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key(project_id, id)
);
-- create index if not exists generated_faqs_by_user_id ON generated_faqs(user_id);

create table if not exists project_content (
  id text not null,
  user_id text not null references users(id) on delete no action,
  project_id text not null references projects(id) on delete no action,
  content text not null,
  format text not null, -- 'text' | 'markdown' | 'html'

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key(project_id, id)
);
