-- get

create or replace function get_channels_by_ids(cids bigint[])
returns setof membership.channel_summary
as $$

BEGIN
  set search_path=membership;

  return query
  select 
		channels.id,
		channels.title, 

    channels.team_id,
    teams.title,

		channels.created_by,
		users.email, 
		users.nickname,
    
		channels.created_at,
    channels.type,
    channel_types.can_delete
  from 	
     channels, users, teams, channel_types
  where 
    teams.id = channels.team_id and
    channels.id = any(cids) and 
    channels.type = channel_types.id and
    users.id = channels.created_by;
END;
$$ LANGUAGE plpgsql;

create or replace function get_channel_by_id(cid bigint)
returns membership.channel_summary
as $$

DECLARE
found_channel channel_summary;

BEGIN
  set search_path=membership;
  select * from get_channels_by_ids(array[cid]) into found_channel;
  return found_channel;
END;
$$ LANGUAGE plpgsql;

-- created_channels

create or replace function get_created_channels(uid bigint, tid bigint)
returns setof membership.channel_summary
as $$
DECLARE

BEGIN
  return query
  select 		
    cn.*
  from 
    channels, 
    get_channel_by_id(channels.id) as cn 
  where 
    channels.team_id = tid and
    channels.created_by=uid;
END;
$$ LANGUAGE plpgsql;

-- team_channels

create or replace function get_team_channels(uid bigint, tid bigint)
returns setof membership.channel_summary
as $$
DECLARE

BEGIN
  return query
  select 		
    cn.*
  from 
    channels, 
    get_channel_by_id(channels.id) as cn 
  where 
    channels.team_id = tid;
END;
$$ LANGUAGE plpgsql;

-- create_channel

create or replace function create_channel(uid bigint, tid bigint, tit membership.channels.title%type)
returns membership.channel_summary
as $$
DECLARE
found_id bigint;
new_channel_id bigint;
BEGIN
  set search_path=membership;

  insert into channels(created_by, team_id, title, type) values (uid, tid, tit, 0) returning channels.id into new_channel_id;

  return get_channel_by_id(new_channel_id);
END;
$$ LANGUAGE plpgsql;

-- update_channel_title

create or replace function update_channel_title(uid bigint, tid bigint, channel_id bigint, tit membership.channels.title%type)
returns membership.channel_summary
as $$
DECLARE
BEGIN
  set search_path=membership;
  update channels set title=tit where uid=channels.created_by and tid=channels.team_id and channels.id = channel_id;
  return get_channel_by_id(channel_id);
END;
$$ LANGUAGE plpgsql;

-- delete_channel

create or replace function delete_channel(uid bigint, tid bigint, channel_id bigint)
returns membership.channel_summary
as $$
DECLARE
channel_tobe_delete membership.channel_summary;
BEGIN
  set search_path=membership;
  channel_tobe_delete:=get_channel_by_id(channel_id);
  delete from 
    channels 
  where 
    id=channel_id 
  and created_by = uid and channels.team_id = tid and channels.type = 0;
  return channel_tobe_delete;
END;
$$ LANGUAGE plpgsql;

-- star_channels

create or replace function star_channel(uid bigint, cid bigint)
returns membership.channel_summary
as $$
BEGIN
  set search_path=membership;
  insert into user_fav_channels(user_id, channel_id) values (uid, cid);
  return get_channel_by_id(cid);
END;
$$ LANGUAGE plpgsql;

-- unstar_channels

create or replace function unstar_channel(uid bigint, cid bigint)
returns membership.channel_summary
as $$
BEGIN
  set search_path=membership;
  delete from user_fav_channels 
  where user_fav_channels.channel_id=cid and 
    user_fav_channels.user_id = uid;
  return get_channel_by_id(cid);
END;
$$ LANGUAGE plpgsql;

-- get_fav_channels

create or replace function get_fav_channels(uid bigint, tid bigint)
returns setof membership.channel_summary
as $$
BEGIN
  set search_path=membership;

  return query
  select 		
    cn.*
  from 
    channels, 
    get_channel_by_id(channels.id) as cn 
  where 
    channels.created_by = uid and 
    channels.team_id = tid

  union

  select 		
    cn.*
  from 
    user_fav_channels,
    channels,
    get_channel_by_id(user_fav_channels.channel_id) as cn 
  where 
    user_fav_channels.user_id = uid and 
    user_fav_channels.channel_id = channels.id and
    channels.team_id = tid;
  

END;
$$ LANGUAGE plpgsql;

-- visit_channel

create or replace function visit_channel(uid bigint, cid bigint)
returns membership.channel_summary
as $$
DECLARE
visited_channel_id bigint;
BEGIN
  set search_path=membership;
  insert into user_last_visit_channels(user_id, channel_id) 
  values (uid, cid)
  on conflict(user_id) do
  UPDATE set channel_id = cid
  returning user_last_visit_channels.channel_id 
  into visited_channel_id;
  return get_channel_by_id(visited_channel_id);
END;
$$ LANGUAGE plpgsql;

-- get_last_visit_channel

create or replace function get_last_visit_team_channel(uid bigint, tid bigint)
returns membership.channel_summary
as $$
DECLARE
found_channel_id bigint;
BEGIN
  set search_path=membership;

  select 		
    user_last_visit_channels.channel_id into found_channel_id
  from 
    user_last_visit_channels, channels
  where 
    user_last_visit_channels.user_id = uid and 
    user_last_visit_channels.channel_id = channels.id and
    channels.team_id = tid;

  if found_channel_id is null then
    select
      channels.id into found_channel_id
    from 
      channels
    where 
      channels.team_id = tid;
  end if;

  return get_channel_by_id(found_channel_id);

END;
$$ LANGUAGE plpgsql;