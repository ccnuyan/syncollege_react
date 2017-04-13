create table user_fav_channels(
  user_id bigint not null,
  channel_id bigint not null,
  joined_at timestamptz default now() not null,
  last_visit timestamptz default now() not null,
  PRIMARY KEY (user_id, channel_id)
);