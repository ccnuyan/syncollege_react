// import moment from 'moment';

// function query(arg1, arg2) {
//   // console.log('******' + moment(Date.now()).format('hh:mm:ss.SSS'));
//   // console.log(arg1);
//   // console.log('------------------with---------------------');
//   // console.log(JSON.stringify(arg2, null, 2));
//   // console.log('------------------get---------------------');
//   return pg.pool.query(arg1, arg2).then(res => {
//     // console.log(JSON.stringify(res.rows, null, 2))
//     // console.log('******' + moment(Date.now()).format('hh:mm:ss.SSS'));
//     return res;
//   });
// }

const get_team_by_id = (pool, {id}) => {
  return pool.query('select * from membership.get_team_by_id($1)', [id]);
};

const get_teams_by_ids = (pool, {ids}) => {
  return pool.query('select * from membership.get_teams_by_ids($1)', [ids]);
};

const get_created_teams = (pool, {uid}) => {
  return pool.query('select * from membership.get_created_teams($1)', [uid]);
};

const create_team = (pool, {uid, title}) => {
  return pool.query('select * from membership.create_team($1, $2)', [uid, title]);
};

const update_team_title = (pool, {uid, id, title}) => {
  return pool.query('select * from membership.update_team_title($1, $2, $3)', [uid, id, title]);
};

const delete_team = (pool, {uid, id}) => {
  return pool.query('select * from membership.delete_team($1, $2)', [uid, id]);
};

const get_joined_teams = (pool, {uid}) => {
  return pool.query('select * from membership.get_joined_teams($1)', [uid]);
};

const join_team = (pool, {uid, id}) => {
  return pool.query('select * from membership.join_team($1, $2)', [uid, id]);
};

const exit_team = (pool, {uid, id}) => {
  return pool.query('select * from membership.exit_team($1, $2)', [uid, id]);
};


const get_last_visit_team = (pool, {uid}) => {
  return pool.query('select * from membership.get_last_visit_team($1)', [uid]);
};

const get_last_visit_team_channel = (pool, {uid, tid}) => {
  return pool.query('select * from membership.get_last_visit_team_channel($1, $2)', [uid, tid]);
};


export default {
  get_team_by_id,
  get_teams_by_ids,
  get_created_teams,
  create_team,
  update_team_title,
  delete_team,

  get_joined_teams,
  join_team,
  exit_team,

  get_last_visit_team,
  get_last_visit_team_channel,
};
