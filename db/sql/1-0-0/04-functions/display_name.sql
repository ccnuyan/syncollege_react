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
