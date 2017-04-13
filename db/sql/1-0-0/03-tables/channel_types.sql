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
