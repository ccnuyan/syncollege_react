import _ from 'lodash';

import assert from 'assert';
import Helpers from './helpers';
import authentication from './authentication';
import channel from './channel';
import team from './team';

const helpers = new Helpers();
let pool = null;

let createdTeam = null;

const user1 = {

  email: 'ccnuyan@qq.com',
  password: 'password',
};
const user2 = {

  email: 'ccnuyan@pp.net',
  password: 'password',
};

const title1 = 'my channel1';
const title2 = 'my channel2';
let changeResult1 = null;
let changeResult2 = null;
let ret1 = null;
let ret2 = null;
let user1ret = null;
let user2ret = null;

describe('channel star', () => {
  before(async () => {
    pool = await helpers.initDb();
    await Promise.all([
      authentication.register(pool, user1).then((res) => {
        user1ret = res.rows[0];
        user1.id = user1ret.new_id;
      }),
      authentication.register(pool, user2).then((res) => {
        user2ret = res.rows[0];
        user2.id = user2ret.new_id;
      })]);

    return team.create_team(pool, {
      uid: user1.id,
      title: 'team star',
    }).then((res) => {
      createdTeam = res.rows[0];
    });
  });

  describe('USER2: creating two channels', () => {
    before(async () => {
      return Promise.all([
        channel.create_channel(pool, {
          uid: user2.id,
          tid: createdTeam.id,
          title: title1,
        }).then((res) => {
          changeResult1 = res.rows[0];
        }),
        channel.create_channel(pool, {
          uid: user2.id,
          tid: createdTeam.id,
          title: title2,
        }).then((res) => {
          changeResult2 = res.rows[0];
        }),
      ]).catch(err => console.log(err));
    });
    it('with correct channel title', () => {
      assert.equal(title1, changeResult1.title);
      assert.equal(title2, changeResult2.title);
    });
    describe('USER2: getting channel by id', () => {
      before(async () => {
        return channel.get_channel_by_id(pool, {
          id: changeResult1.id,
        }).then((res) => {
          changeResult1 = res.rows[0];
        });
      });
      it('with correct channel title1', () => {
        assert.equal(title1, changeResult1.title);
      });

      before(async () => {
        return channel.get_channel_by_id(pool, {
          id: changeResult2.id,
        }).then((res) => {
          changeResult2 = res.rows[0];
        });
      });
      it('with correct channel title2', () => {
        assert.equal(title2, changeResult2.title);
      });
    });
    describe('USER2: getting channels by ids', () => {
      let changeResult = null;

      before(async () => {
        return channel.get_channels_by_ids(pool, {
          ids: [changeResult1.id, changeResult2.id],
        }).then((res) => {
          changeResult = res.rows;
        });
      });
      it('with correct channel titles', () => {
        ret1 = _.find(changeResult, (it) => {
          return it.title === title1;
        });
        ret2 = _.find(changeResult, (it) => {
          return it.title === title2;
        });
        assert.notEqual(ret1.title, ret2.title);
        assert.notEqual(null, ret1);
        assert.notEqual(null, ret2);
      });

      describe('USER2: getting fav channels', () => {
        changeResult = null;

        before(async () => {
          return channel.get_fav_channels(pool, {
            uid: user2.id,
            tid: createdTeam.id,
          }).then((res) => {
            changeResult = res.rows;
          });
        });
        it('with correct channel titles', () => {
          assert.equal(2, changeResult.length);
          ret1 = _.find(changeResult, (it) => {
            return it.title === title1;
          });
          ret2 = _.find(changeResult, (it) => {
            return it.title === title2;
          });
          assert.notEqual(null, ret1);
          assert.notEqual(null, ret2);
        });
      });
    });
  });

  describe('USER1: staring user 2 channel 1', () => {
    let changeResult = null;

    before(async () => {
      return channel.star_channel(pool, {
        uid: user1.id,
        id: ret1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct channel title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret1.title, changeResult[0].title);
    });

    describe('USER1: getting stared_channels again', () => {
      before(async () => {
        return channel.get_fav_channels(pool, {
          uid: user1.id,
          tid: createdTeam.id,
        }).then((res) => {
          changeResult = res.rows;
        });
      });

      it('with correct channel title', () => {
        assert.equal(3, changeResult.length);
        ret1 = _.find(changeResult, (it) => {
          return it.title === title1;
        });
        assert.notEqual(null, ret1);
      });
    });
  });

  describe('USER1: staring user 2 channel 2', () => {
    let changeResult = null;

    before(async () => {
      return channel.star_channel(pool, {
        uid: user1.id,
        id: ret2.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct channel title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret2.title, changeResult[0].title);
    });

    describe('USER1: getting stared_channels again', () => {
      before(async () => {
        return channel.get_fav_channels(pool, {
          uid: user1.id,
          tid: createdTeam.id,
        }).then((res) => {
          changeResult = res.rows;
        });
      });

      it('with 2 correct channels', () => {
        assert.equal(4, changeResult.length);
        ret1 = _.find(changeResult, (it) => {
          return it.title === title1;
        });
        ret2 = _.find(changeResult, (it) => {
          return it.title === title2;
        });
        assert.notEqual(null, ret1);
        assert.notEqual(null, ret2);
      });
    });
  });

  describe('USER1: unstar user 2 channel 1', () => {
    let changeResult = null;

    before(async () => {
      return channel.unstar_channel(pool, {
        uid: user1.id,
        id: ret1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct channel title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret1.title, changeResult[0].title);
    });
  });

  describe('USER1: unstar user 2 channel 2', () => {
    let changeResult = null;

    before(async () => {
      return channel.unstar_channel(pool, {
        uid: user1.id,
        id: ret2.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct channel title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret2.title, changeResult[0].title);
    });
  });

  describe('USER1: getting stared_channels again', () => {
    let changeResult = null;

    before(async () => {
      return channel.get_fav_channels(pool, {
        uid: user1.id,
        tid: createdTeam.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });

    it('with 0 correct channels', () => {
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
