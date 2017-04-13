create type joined_channels as(
  channel_id bigint,
  channel_title varchar(127),
  creator varchar(255),
  creator_id varchar(50),
  joined_at timestamptz,
  is_creator boolean
);
