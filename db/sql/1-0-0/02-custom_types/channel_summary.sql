create type channel_summary as(
  id bigint,
  title varchar(127),
  
  team_id bigint,
  team_title varchar(127),

  created_by bigint,
  owner_email varchar(255),
  owner_nickname varchar(63),

  created_at timestamptz,
  
  type int,
  can_delete boolean
);