
-- get

create or replace function get_teams_by_ids(cids bigint[])
returns setof membership.team_summary
as $$

BEGIN
  set search_path=membership;

  return query
  select 
		teams.id,
		teams.title, 
		users.email, 
		users.nickname,
		teams.created_by,
		teams.created_at
  from 	
     teams, users
  where 
    teams.id=any(cids) and 
    users.id=teams.created_by;
END;
$$ LANGUAGE plpgsql;

create or replace function get_team_by_id(cid bigint)
returns membership.team_summary
as $$

DECLARE
found_team team_summary;

BEGIN
  set search_path=membership;
  select * from get_teams_by_ids(array[cid]) into found_team;
  return found_team;
END;
$$ LANGUAGE plpgsql;

-- created_teams

create or replace function get_created_teams(uid bigint)
returns setof membership.team_summary
as $$

DECLARE

tids bigint[];
tid bigint;

BEGIN
  set search_path=membership;

  return query
  select 		
    cn.id as id,
    cn.title as title, 
    cn.owner_email as owner_email, 
    cn.owner_nickname as owner_nickname,
    cn.created_by as created_by,
    cn.created_at as created_at
  from 
    teams, 
    get_team_by_id(teams.id) as cn 
  where 
    teams.created_by=uid 
  order by 
    created_at 
  desc;
END;
$$ LANGUAGE plpgsql;

-- create_team

create or replace function create_team(uid bigint, tit varchar(127))
returns membership.team_summary
as $$

DECLARE
new_team_id bigint;

BEGIN
  set search_path=membership;

  insert into teams(created_by, title) values (uid, tit) returning teams.id into new_team_id;
  
  insert into channels(created_by, team_id, title, type) values (uid, new_team_id, 'Home', 10);
  insert into channels(created_by, team_id, title, type) values (uid, new_team_id, 'My Channel', 99);

  return get_team_by_id(new_team_id);
END;
$$ LANGUAGE plpgsql;

-- update_team_title

create or replace function update_team_title(uid bigint, team_id bigint, tit varchar(127))
returns membership.team_summary
as $$

BEGIN
  set search_path=membership;

  update teams set title=tit where id=team_id and created_by = uid;
  return get_team_by_id(team_id);
END;
$$ LANGUAGE plpgsql;



-- delete_team

create or replace function delete_team(uid bigint, team_id bigint)
returns membership.team_summary
as $$

DECLARE
team_tobe_delete membership.team_summary;

BEGIN
  set search_path=membership;
  team_tobe_delete:=get_team_by_id(team_id);
  delete from teams where id=team_id and created_by = uid;
  return team_tobe_delete;

END;
$$ LANGUAGE plpgsql;

-- fav_teams

create or replace function join_team(uid bigint, tid bigint)
returns membership.team_summary
as $$

DECLARE
new_team_id bigint;

BEGIN
  set search_path=membership;

  insert into user_joined_teams(user_id, team_id) values (uid, tid) returning user_joined_teams.team_id into new_team_id;
  return get_team_by_id(new_team_id);

END;
$$ LANGUAGE plpgsql;

-- exit_team

create or replace function exit_team(uid bigint, tid bigint)
returns membership.team_summary
as $$

DECLARE
team_tobe_delete membership.team_summary;

BEGIN
  set search_path=membership;

  delete from user_joined_teams where team_id=tid and user_id = uid;
  return get_team_by_id(tid);

END;
$$ LANGUAGE plpgsql;

-- get_joined_teams

create or replace function get_joined_teams(uid bigint)
returns setof membership.team_summary
as $$

DECLARE
joined_teams bigint[];

BEGIN
  set search_path=membership;

  return query
  select * from get_created_teams(uid)
  union
  select team.* from 
    user_joined_teams, membership.get_team_by_id(user_joined_teams.team_id) as team 
  where 
    user_joined_teams.user_id = uid;

END;
$$ LANGUAGE plpgsql;

-- get_last_visit_team

create or replace function get_last_visit_team(uid bigint)
returns membership.team_summary
as $$
DECLARE
found_team_id bigint;
BEGIN
  set search_path=membership;

  select 		
    channels.team_id into found_team_id
  from 
    user_last_visit_channels, channels
  where 
    user_last_visit_channels.user_id = uid and 
    user_last_visit_channels.channel_id = channels.id;

  if found_team_id is null then
    select 		
      joined_teams.id into found_team_id
    from 
      get_joined_teams(uid) as joined_teams
    limit 1; 
  end if;
  return get_team_by_id(found_team_id);

END;
$$ LANGUAGE plpgsql;