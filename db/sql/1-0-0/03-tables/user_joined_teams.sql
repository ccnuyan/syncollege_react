create table user_joined_teams(
  user_id bigint not null,
  team_id bigint not null,
  joined_at timestamptz default now() not null,
  star_at timestamptz default now() not null,
  last_visit timestamptz default now() not null,
  PRIMARY KEY (user_id, team_id)
);