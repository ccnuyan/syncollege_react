import assert from 'assert';
import _ from 'lodash';

import Helpers from './helpers';
import authentication from './authentication';
import team from './team';
import channel from './channel';

const helpers = new Helpers();
let pool = null;

const uid = 1234657980;

let user = {
  email: 'ccnuyan@qq.com',
  password: 'password',
};

let createdTeam = null;
let createdChannel = null;
const teamtitle = 'new team';
const title0 = 'my channel0';
const title1 = 'my channel1';

describe('channel create', () => {
  before(async () => {
    pool = await helpers.initDb();
    await authentication.register(pool, user).then((res) => {
      user = res.rows[0];
      user.id = res.rows[0].new_id;
    });
    return team.create_team(pool, {
      uid: user.id,
      title: teamtitle,
    }).then((res) => {
      createdTeam = res.rows[0];
    });
  });

  // USER 1

  describe('getting channels of a not-existed user', () => {
    let changeResult = null;
    before(() => {
      return team.get_created_teams(pool, {
        uid,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with no record', () => {
      assert.equal(0, changeResult.length);
    });
  });

  describe('getting channels of a brand new team', () => {
    let changeResult = null;
    before(() => {
      return channel.get_created_channels(pool, {
        uid: user.id,
        tid: createdTeam.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with no record', () => {
      assert.equal(null, _.countBy(changeResult, 'type')['0']);
      assert.equal(2, changeResult.length);
    });
  });

  describe('creating channel', () => {
    let changeResult = null;
    before(() => {
      return channel.create_channel(pool, {
        uid: user.id,
        tid: createdTeam.id,
        title: title0,
      }).then((res) => {
        changeResult = res.rows;
        createdChannel = res.rows[0];
      });
    });
    it('with correct channel title', () => {
      assert.equal(title0, changeResult[0].title);
    });
  });

  describe('updating channel', () => {
    let changeResult = null;
    before(() => {
      return channel.update_channel_title(pool, {
        uid: user.id,
        tid: createdTeam.id,
        id: createdChannel.id,
        title: title1,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct channel title', () => {
      assert.equal(title1, changeResult[0].title);
    });
  });

  describe('getting channels of team', () => {
    let changeResult = null;
    before(() => {
      return channel.get_created_channels(pool, {
        uid: user.id,
        tid: createdTeam.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with 1 record', () => {
      assert.equal(1, _.countBy(changeResult, 'type')['0']);
      assert.equal(1, _.countBy(changeResult, 'title')[title1]);
      assert.equal(3, changeResult.length);
    });
  });

  describe('delete channel', () => {
    let changeResult = null;
    before(() => {
      return channel.delete_channel(pool, {
        uid: user.id,
        tid: createdTeam.id,
        id: createdChannel.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct channel title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(title1, changeResult[0].title);
    });
  });

  describe('getting channels of team', () => {
    let changeResult = null;
    before(() => {
      return channel.get_created_channels(pool, {
        uid: user.id,
        tid: createdTeam.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with 1 record', () => {
      assert.equal(2, changeResult.length);
    });
  });
});

describe('release the pool', () => {
  before(() => {
    return pool.release();
  });
  it('released', () => {
    assert.equal(0, 0);
  });
});
