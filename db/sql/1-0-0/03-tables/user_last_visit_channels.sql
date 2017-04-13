create table user_last_visit_channels(
  user_id bigint not null PRIMARY KEY,
  channel_id bigint not null
);