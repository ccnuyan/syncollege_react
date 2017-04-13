create table users(
  id bigint primary key not null default id_generator(),
  user_key varchar(18) default random_string(18) not null,
  email varchar(255) unique not null,
  nickname varchar(63),
  search tsvector,
  created_at timestamptz default now() not null,
  status_id int default 10,
  last_login timestamptz,
  login_count int default 0 not null,
  validation_token varchar(36),
  profile jsonb
);
