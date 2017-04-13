const get_member_by_id = (pool, {id}) => {
  return pool.query('select * from users where id=$1', [id]);
};

const get_members_by_ids = (pool, {ids}) => {
  return pool.query('select * from users where id in any($1)', [ids]);
};


export default {
  get_member_by_id,
  get_members_by_ids,
};
