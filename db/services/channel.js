const get_channel_by_id = (pool, {id}) => {
  return pool.query('select * from membership.get_channel_by_id($1)', [id]);
};

const get_channels_by_ids = (pool, {ids}) => {
  return pool.query('select * from membership.get_channels_by_ids($1)', [ids]);
};

const get_created_channels = (pool, {uid, tid}) => {
  return pool.query('select * from membership.get_created_channels($1, $2)', [uid, tid]);
};

const create_channel = (pool, {uid, tid, title}) => {
  return pool.query('select * from membership.create_channel($1, $2, $3)', [uid, tid, title]);
};

const update_channel_title = (pool, {uid, tid, id, title}) => {
  return pool.query('select * from membership.update_channel_title($1, $2, $3, $4)', [uid, tid, id, title]);
};

const delete_channel = (pool, {uid, tid, id}) => {
  return pool.query('select * from membership.delete_channel($1, $2, $3)', [uid, tid, id]);
};

const get_fav_channels = (pool, {uid, tid}) => {
  return pool.query('select * from membership.get_fav_channels($1, $2)', [uid, tid]);
};

const get_team_channels = (pool, {uid, tid}) => {
  return pool.query('select * from membership.get_team_channels($1, $2)', [uid, tid]);
};

const star_channel = (pool, {uid, id}) => {
  return pool.query('select * from membership.star_channel($1, $2)', [uid, id]);
};
const unstar_channel = (pool, {uid, id}) => {
  return pool.query('select * from membership.unstar_channel($1, $2)', [uid, id]);
};


export default {
  get_channel_by_id,
  get_channels_by_ids,
  get_created_channels,
  create_channel,
  update_channel_title,
  delete_channel,

  get_fav_channels,
  get_team_channels,
  star_channel,
  unstar_channel,
};
