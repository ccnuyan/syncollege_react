set search_path=membership;
drop schema if exists membership CASCADE;

create schema membership;
set search_path = membership;

select 'Schema initialized' as result;

create extension if not exists pgcrypto with schema membership;

set search_path = membership;
create sequence id_sequence;
create or replace function id_generator(out new_id bigint)
as $$
DECLARE
  our_epoch bigint := 1072915200000; -- Pluralsight founding
  seq_id bigint;
  now_ms bigint;
  shard_id int := 1;
BEGIN
  SELECT nextval('id_sequence') %1024 INTO seq_id;
  SELECT FLOOR(EXTRACT(EPOCH FROM now()) * 1000) INTO now_ms;
  new_id := (now_ms - our_epoch) << 23;
  new_id := new_id | (shard_id << 10);
  new_id := new_id | (seq_id);
END;
$$
LANGUAGE PLPGSQL;


create or replace function random_string(len int default 36)
returns text
as $$
select upper(substring(md5(random()::text), 0, len+1));
$$ 
language sql;

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
create type joined_channels as(
  channel_id bigint,
  channel_title varchar(127),
  creator varchar(255),
  creator_id varchar(50),
  joined_at timestamptz,
  is_creator boolean
);

create type log_type as ENUM(
  'Registration',
  'Authentication',
  'Activity',
  'System'
);

create type team_summary as(
  id bigint,
  title varchar(127),
  owner_email varchar(255),
  owner_nickname varchar(63),
  created_by bigint,
  created_at timestamptz
);
create type user_summary as(
  id bigint,
  email varchar(255),
  status varchar(50),
  can_login boolean,
  is_admin boolean,
  display_name varchar(255),
  user_key varchar(18),
  email_validation_token varchar(36),
  user_for interval,
  profile jsonb,
  logs jsonb,
  notes jsonb
);

create table channels(
  id bigint primary key not null default id_generator(),
  team_id bigint not null,
  created_by bigint not null,
  created_at timestamptz default now() not null,
  title varchar(127),
  type int not null
);
create table channel_types (
    id int primary key not null,
    name varchar(50),
    description varchar(255),
    can_delete boolean not null default true
);

-- default channel types
insert into membership.channel_types(id, name, description) values(0, 'Normal', 'Channel in this team');
insert into membership.channel_types(id, name, description, can_delete) values(10, 'Home', 'This is the team''s HOMEPAGE', false);
insert into membership.channel_types(id, name, description, can_delete) values(99, 'Private', 'This is your HOMEPAGE in this team', false);

create table logins(
  id bigint primary key default id_generator(),
  user_id bigint not null,
  provider varchar(50) not null default 'local',
  provider_key varchar(255),
  provider_token varchar(255) not null
);

create table logs(
  id serial primary key,
  subject log_type,
  user_id bigint,
  entry text not null,
  data jsonb,
  created_at timestamptz default now()
);

create table notes(
    id serial primary key not null,
    user_id bigint not null,
    note text not null,
    created_at timestamptz default current_timestamp
);

create table roles(
    id integer primary key not null,
    description varchar(24) not null
);

create table users_roles(
    user_id bigint not null,
    role_id int not null,
    primary key (user_id, role_id)
);

-- default roles
insert into membership.roles (id, description) values(10, 'Administrator');
insert into membership.roles (id, description) values(99, 'User');

create table status(
    id int  primary key not null,
    name varchar(50),
    description varchar(255),
    can_login boolean not null default true
);

-- default statuses
insert into membership.status(id, name, description) values(10, 'Active', 'User can login, etc');
insert into membership.status(id, name, description,can_login) values(20, 'Suspended','Cannot login for a given reason',false);
insert into membership.status(id, name, description,can_login) values(30, 'Not Approved','Member needs to be approved (email validation, etc)',false);
insert into membership.status(id, name, description,can_login) values(99, 'Banned','Member has been banned',false);
insert into membership.status(id, name, description,can_login) values(88, 'Locked', 'Member is locked out due to failed logins',false);

create table teams(
  id bigint primary key not null default id_generator(),
  created_by bigint not null,
  created_at timestamptz default now() not null,
  title varchar(127)
);
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

create table user_fav_channels(
  user_id bigint not null,
  channel_id bigint not null,
  joined_at timestamptz default now() not null,
  last_visit timestamptz default now() not null,
  PRIMARY KEY (user_id, channel_id)
);
create table user_joined_teams(
  user_id bigint not null,
  team_id bigint not null,
  joined_at timestamptz default now() not null,
  star_at timestamptz default now() not null,
  last_visit timestamptz default now() not null,
  PRIMARY KEY (user_id, team_id)
);
create table user_last_visit_channels(
  user_id bigint not null PRIMARY KEY,
  channel_id bigint not null
);
drop function if exists add_login(varchar,varchar,varchar,varchar);
create function add_login(
    em varchar(255),
    key varchar(50),
    token varchar(255),
    new_provider varchar(50)
)
returns TABLE(
  message varchar(255),
  success boolean
) as
$$
DECLARE
  success boolean :=false;
  message varchar(255) := 'User not found with this email';
  found_id bigint;
  data_result json;
BEGIN
  set search_path = membership;
  select id into found_id from users where email = em;

  if found_id is not null then
    --replace the provider for this user completely
    delete from logins where 
      found_id = logins.user_id AND 
      logins.provider = new_provider;

    --add the login
    insert into logins(user_id,provider_key, provider_token, provider)
    values (found_id, key,token,new_provider);

    --add log entry
    insert into logs(subject,entry,user_id, created_at)
    values('Authentication','Added ' || new_provider || ' login',found_id,now());

    success := true;
    message :=  'Added login successfully';
  end if;

  return query
  select message, success;

END;
$$
language plpgsql;
create or replace function add_user_to_role(em varchar(255), new_role_id int)
returns user_summary
as $$
DECLARE
found_id bigint;
selected_role varchar(50);
BEGIN
  set search_path=membership;
  select id into found_id from users where email=em;
  if found_id is not null then
    if not exists(select user_id from users_roles where user_id = found_id and role_id=new_role_id) then
      insert into users_roles(user_id, role_id) values (found_id, new_role_id);

      --add a log entry
      select description into selected_role from roles where id=new_role_id;
      insert into logs(subject,entry,user_id, created_at)
      values('Registration','Member added to role ' || selected_role,found_id,now());

      --add a note
      insert into notes(user_id, note)
      values (found_id, 'Added to role ' || selected_role);
    end if;
  end if;
  return get_user(em);
END;
$$ LANGUAGE plpgsql;

create or replace function authenticate(key varchar, token varchar, prov varchar default 'local')
returns table(
  return_id bigint,
  email varchar(255),
  display_name varchar(50),
  success boolean,
  message varchar(50)
) as $$
DECLARE
  found_user membership.users;
  return_message varchar(50);
  success boolean := false;
  found_id bigint;
  can_login boolean := false;
BEGIN
  set search_path=membership;
  --find the user by token/provider and key
  if(prov = 'local') then
    select locate_user_by_password(key, token) into found_id;
  else
    select user_id from logins where
    provider = prov and
    provider_key = key and
    provider_token = token into found_id;
  end if;

  if(found_id is not null) then
    select * from users where users.id = found_id into found_user;

    select status.can_login from status where id=found_user.status_id
    into can_login;

    if(can_login) then
      --add a log entry
      insert into logs(user_id, subject, entry)
      values(found_id, 'Authentication', 'Logged user in using ' || prov);

      --set a last_login
      update users set last_login=now(), login_count=login_count+1
      where users.id=found_id;

      --set the display_name
      display_name := display_name(found_user);

      success := true;
      return_message := 'Welcome!';
    else
      --log failed attempt
      insert into logs(user_id, subject, entry)
      values(found_id, 'Authentication', 'User tried to login, is locked out');

      success := false;
      return_message := 'This user is currently locked out';
    end if;
  else
    return_message := 'Invalid login credentials';
  end if;
  return query
  select found_id, found_user.email, display_name, success, return_message;
END;
$$
language plpgsql;

create or replace function authenticate_by_token(token varchar)
returns table(
  return_id bigint,
  email varchar(255),
  display_name varchar(50),
  success boolean,
  message varchar(50)
) as $$
begin
  return query
  select * from authenticate('token', token, 'token');
end;
$$
language plpgsql;

create or replace function change_password(em varchar, old_pass varchar, new_pass varchar)
returns user_summary
as $$
DECLARE
  found_id bigint;
BEGIN
  set search_path=membership;
  --find the user based on email/password
  select locate_user_by_password(em,old_pass) into found_id;
  if found_id is not null then
    --change the password if all is OK
    update logins set provider_token = crypt(new_pass, gen_salt('bf',10))
    where user_id=found_id and provider='local';

    --log it
    insert into logs(user_id, subject, entry)
    values(found_id, 'Authentication', 'Password changed');

    --add a note to the account
    insert into notes(user_id, note)
    values(found_id, 'Successfully changed password');
  end if;
  return get_user(em);
END;
$$
language plpgsql;

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
create or replace function display_name(u users)
returns varchar(255)
as $$
BEGIN
  if(u.nickname is not null) then
    return u.nickname;
  else
    return u.email;
  end if;
END;
$$
language plpgsql;

create or replace function get_user(em varchar)
returns user_summary
as $$
declare 
  dname varchar(255);
  found_user users;
  member_for interval;
  can_login boolean;
  is_admin boolean;
  return_status varchar(25);
  json_logs jsonb;
  json_notes jsonb;
  json_channels jsonb;
  user_status status;
begin
  set search_path=membership;
  --are they in the DB?
  if exists (select users.id from users where users.email = em) then
    select * from users into found_user where users.email = em;

    --display name
    dname := display_name(found_user);

    --member for
    select age(now(),found_user.created_at) into member_for;

    -- status
    select * from status where id=found_user.status_id into user_status;
    can_login:=user_status.can_login;
    return_status:=user_status.name;

    -- is_admin
    select exists(select user_id from users_roles where
                  user_id=found_user.id and role_id=10) into is_admin;
    -- logs
    select json_agg(x) into json_logs from
    (select * from logs where logs.user_id = found_user.id) x;

    -- notes
    select json_agg(y) into json_notes from
    (select * from notes where notes.user_id = found_user.id) y;

    -- channels
    select json_agg(y) into json_channels from
    (select * from channels where channels.created_by = found_user.id) y;
  end if;

  return (found_user.id, 
     found_user.email, 
     return_status,
     can_login,
     is_admin,
     dname,
     found_user.user_key,
     found_user.validation_token,
     member_for,
     found_user.profile,
     json_logs,
     json_notes)::user_summary;
end;
$$
language plpgsql;

create or replace function locate_user_by_password(em varchar, pass varchar)
returns bigint
as $$
  set search_path=membership;
  select user_id from logins where
  provider = 'local' and
  provider_key = em and
  provider_token = crypt(pass,provider_token);
$$
language sql;

create or replace function register(
  new_email varchar, password varchar
)
returns table(
  new_id bigint,
  validation_token varchar(36),
  authentication_token varchar(36),
  success boolean,
  message varchar(255)
) as $$
BEGIN
  set search_path=membership;
  -- see if they exist
  if not exists (select users.email
        from users where
        users.email = new_email) then

    --for email validation
    validation_token := random_string(36);
    --for token-based login
    authentication_token := random_string(36);

    -- add them, get new id
    insert into users(email,validation_token)
    values (new_email,validation_token)
    returning id into new_id;

    -- add logins
    insert into logins(user_id, provider_key, provider_token)
    values(new_id, new_email, crypt(password, gen_salt('bf', 10)));

    -- token login
    insert into logins(user_id, provider, provider_key, provider_token)
    values(new_id, 'token', 'token', authentication_token);

    --add them to the user role
    insert into users_roles(user_id, role_id)
    values (new_id, 99);

    -- log it
    insert into logs(user_id, subject, entry)
    values(new_id, 'Registration', 'User registered with email ' || new_email);

    success := true;
    message := 'Welcome!';
  else
    success := false;
    select 'This email is already registered' into message;
  end if;

  -- return the goods
  return query
  select new_id, validation_token, authentication_token, success, message;
END;
$$
language plpgsql;

create or replace function remove_user_from_role(em varchar(255), remove_role_id int)
returns user_summary
as $$
DECLARE
found_id bigint;
selected_role varchar(50);
BEGIN
  set search_path=membership;
  select id into found_id from users where email=em;
  if found_id is not null then
    --remove it
    delete from users_roles where user_id=found_id and role_id=remove_role_id;
    --add a log entry
    select description into selected_role from roles where id=remove_role_id;
    insert into logs(subject,entry,user_id, created_at)
    values('Registration','Member removed from role ' || selected_role,found_id,now());

    --add a note
    insert into notes(user_id, note)
    values (found_id, 'Removed from role ' || selected_role);

  end if;
  return get_user(em);
END;
$$ LANGUAGE plpgsql;

create or replace function change_status(
  em varchar,
  new_status_id int,
  reason varchar(50)
)
returns user_summary
as $$
DECLARE
  found_id bigint;
  status_name varchar(50);
  user_record user_summary;
BEGIN
  set search_path = membership;
  select name from status where id=new_status_id into status_name;
  select id from users where users.email=em
  into found_id;
  if found_id is not null then
    --reset the status
    update users set status_id=new_status_id where id=found_id;
    --add a note
    insert into notes(user_id, note)
    values (found_id, 'Your status was changed to ' || status_name);
    --add a log
    insert into logs(user_id, subject, entry)
    values(found_id, 'System','Changed status to ' || status_name || ' because ' || reason);
    --pull the user
    user_record := get_user(em);
  end if;
  return user_record;
END;
$$
language plpgsql;

create or replace function suspend_user(em varchar,reason varchar)
returns user_summary
as $$
  set search_path = membership;
  select change_status(em, 20, reason);
$$ 
language sql;

create or replace function lock_user(em varchar,reason varchar)
returns user_summary
as $$
  set search_path = membership;
  select change_status(em, 88, reason);
$$ 
language sql;

create or replace function ban_user(em varchar,reason varchar)
returns user_summary
as $$
  set search_path = membership;
  select change_status(em, 99, reason);
$$ 
language sql;

create or replace function activate_user(em varchar,reason varchar)
returns user_summary
as $$
  set search_path = membership;
  select change_status(em, 10, reason);
$$ 
language sql;


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
create or replace function update_user(em varchar, nn varchar, profile_data jsonb)
returns user_summary
as $$
declare
  found_id bigint;
begin
  select id from users into found_id where email=em;
  if found_id is not null then
    update users set
    nickname=nn,
    profile=profile_data
    where id=found_id;
  end if;
  return get_user(em);
end;
$$
language plpgsql;

drop function if exists validate_email(varchar);
create function validate_email(token varchar)
returns user_summary
as $$
declare
  found_id bigint;
  em varchar(255);
begin
  set search_path = membership;
  -- find the user
  select id from users into found_id where validation_token=token;
  
  if found_id is not null then 
    -- get the email
    select email from users where id=found_id into em;

    -- set status to active
    perform activate_user(em, 'Email validated');

    -- add a note
    insert into notes(user_id, note)
    values (found_id, 'Your email was validated');
  end if;

  --return the summary, which will have logs etc
  return get_user(em);
end;
$$ language plpgsql;
DROP TRIGGER IF EXISTS users_search_vector_refresh on membership.users;
CREATE TRIGGER users_search_vector_refresh
BEFORE INSERT OR UPDATE ON membership.users
FOR EACH ROW EXECUTE PROCEDURE
tsvector_update_trigger(search, 'pg_catalog.english',  email, nickname);

ALTER TABLE logins
ADD CONSTRAINT logins_users
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE logs
ADD CONSTRAINT logs_users
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE notes 
ADD CONSTRAINT notes_users 
FOREIGN KEY (user_id) REFERENCES users (id) on delete cascade;

ALTER TABLE users_roles 
ADD CONSTRAINT user_roles_users 
FOREIGN KEY (user_id) REFERENCES users (id) on delete cascade;

ALTER TABLE users_roles 
ADD CONSTRAINT member_roles_roles
FOREIGN KEY (role_id) REFERENCES roles (id) on delete cascade;

ALTER TABLE users 
ADD CONSTRAINT users_status
FOREIGN KEY (status_id) REFERENCES status (id); 


ALTER TABLE channels
ADD CONSTRAINT user__channels
FOREIGN KEY (created_by) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE teams
ADD CONSTRAINT teams
FOREIGN KEY (created_by) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE channels
ADD CONSTRAINT team__channels
FOREIGN KEY (team_id) REFERENCES teams(id)
ON DELETE CASCADE;


ALTER TABLE user_last_visit_channels
ADD CONSTRAINT user__user_last_visit_channels
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;


ALTER TABLE user_fav_channels
ADD CONSTRAINT user__user_fav_channels
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE user_fav_channels
ADD CONSTRAINT channel__user_fav_channels
FOREIGN KEY (channel_id) REFERENCES channels(id)
ON DELETE CASCADE;


ALTER TABLE user_joined_teams
ADD CONSTRAINT user__user_joined_teams
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE user_joined_teams
ADD CONSTRAINT team__user_joined_teams
FOREIGN KEY (team_id) REFERENCES teams(id)
ON DELETE CASCADE;
