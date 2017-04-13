create type team_summary as(
  id bigint,
  title varchar(127),
  owner_email varchar(255),
  owner_nickname varchar(63),
  created_by bigint,
  created_at timestamptz
);