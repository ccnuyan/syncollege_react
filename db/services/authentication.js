const register = (pool, {email, password}) => {
  return pool.query('select * from membership.register($1, $2)', [email, password]);
};

const authentiacate = (pool, {email, password}) => {
  return pool.query('select * from membership.authenticate($1, $2, \'local\')', [email, password]);
};

const authenticate_by_token = (pool, {token}) => {
  return pool.query('select * from membership.authenticate_by_token($1)', [token]);
};

const lock_out = (pool, {id}) => {
  return pool.query('update membership.users set status_id=20 where id=$1', [id]);
};

const change_password = (pool, {email, password, new_password}) => {
  return pool.query('select * from change_password($1,$2,$3)', [email, password, new_password]);
};

const update_user = (pool, {email, nickname, body}) => {
  return pool.query('select * from update_user($1,$2,$3)', [email, nickname, JSON.stringify(body)]);
};
const add_user_to_role = (pool, {email, role}) => {
  return pool.query('select * from membership.add_user_to_role($1,$2)', [email, role]);
};

const remove_user_from_role = (pool, {email, role}) => {
  return pool.query('select * from membership.remove_user_from_role($1,$2)', [email, role]);
};

const suspend_user = (pool, {email, reason}) => {
  return pool.query('select * from membership.suspend_user($1,$2)', [email, reason]);
};

const lock_user = (pool, {email, reason}) => {
  return pool.query('select * from membership.lock_user($1,$2)', [email, reason]);
};

const ban_user = (pool, {email, reason}) => {
  return pool.query('select * from membership.ban_user($1,$2)', [email, reason]);
};

const activate_user = (pool, {email, reason}) => {
  return pool.query('select * from membership.activate_user($1,$2)', [email, reason]);
};


export default {
  register,
  authentiacate,
  authenticate_by_token,
  lock_out,
  change_password,
  update_user,
  add_user_to_role,
  remove_user_from_role,
  suspend_user,
  lock_user,
  ban_user,
  activate_user,
};
