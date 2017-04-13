create table channels(
  id bigint primary key not null default id_generator(),
  team_id bigint not null,
  created_by bigint not null,
  created_at timestamptz default now() not null,
  title varchar(127),
  type int not null
);