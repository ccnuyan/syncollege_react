import { Timestamp } from 'mongodb';

import team from './services/team';
import channel from './services/channel';
import authentication from './services/authentication';

export default async (pPool, mPool) => {
  await pPool.query('delete from membership.users');

  const ret0 = await authentication.register(pPool, {
    email: 'ccnuyan@qq.com',
    password: 'password',
  });

  const ret1 = await authentication.register(pPool, {
    email: 'ccnuyan@live.com',
    password: 'password',
  });

  const uid = ret0.rows[0].new_id;

  await team.create_team(pPool, {
    uid,
    title: 'team 1',
  }).then((res) => {
    channel.create_channel(pPool, {
      uid,
      tid: res.rows[0].id,
      title: 'channel 1 in team 1',
    });

    team.join_team(pPool, {
      uid: ret1.rows[0].new_id,
      id: res.rows[0].id,
    });

    channel.create_channel(pPool, {
      uid,
      tid: res.rows[0].id,
      title: 'channel 2 in team 1',
    });
  });

  await team.create_team(pPool, {
    uid,
    title: 'team 2',
  }).then((res) => {
    channel.create_channel(pPool, {
      uid,
      tid: res.rows[0].id,
      title: 'channel in team 2',
    });
  });
  await team.create_team(pPool, {
    uid,
    title: 'team 3',
  }).then((res) => {
    channel.create_channel(pPool, {
      uid,
      tid: res.rows[0].id,
      title: 'channel in team 3',
    });
  });

  const team1 = await team.get_last_visit_team(pPool, {
    uid,
  }).then((res) => {
    return res.rows[0];
  });

  const channel1 = await team.get_last_visit_team_channel(pPool, {
    uid,
    tid: team1.id,
  }).then((res) => {
    return res.rows[0];
  });


  await mPool.collection('entries').remove({});

  await mPool.collection('entries').insertOne({
    content: 'hello everybody',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: uid,
  });

  await mPool.collection('entries').insertOne({
    content: 'hi ccnuyan',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: ret1.rows[0].new_id,
  });

  await mPool.collection('entries').insertOne({
    title: 'new entry 1',
    content: 'something about entry 1',
    entry_type: 'post',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: uid,
  });

  await mPool.collection('entries').insertOne({
    content: 'well done',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: ret1.rows[0].new_id,
  });

  await mPool.collection('entries').insertOne({
    title: 'new entry 2',
    content: 'something interesting',
    entry_type: 'post',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: uid,
  });

  await mPool.collection('entries').insertOne({
    content: 'this is my favorate articles',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: uid,
  });

  await mPool.collection('entries').insertOne({
    /* eslint-disable */
    content: 'that is a long long long long long long long long long \
    long long long long long long long long long long long long long \
    long long long long long long long long long long long long long \
    long long long long long long long story', 
    /* eslint-disable */
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: uid,
  });

  await mPool.collection('entries').insertOne({
    content: 'shut up you ass',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: ret1.rows[0].new_id,
  });

  await mPool.collection('entries').insertOne({
    content: 'you like youtube?',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: uid,
  });


  await mPool.collection('entries').insertOne({
    content: 'ya, used to, but now i like syncollege',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: ret1.rows[0].new_id,
  });


  await mPool.collection('entries').insertOne({
    content: 'syncollege is better',
    entry_type: 'message',
    created_at: new Timestamp(),
    channel_id: channel1.id,
    created_by: uid,
  });

};
