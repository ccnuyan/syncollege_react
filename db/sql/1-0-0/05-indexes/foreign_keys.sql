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
