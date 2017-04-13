import assert from 'assert';
import Helpers from './helpers';
import authentication from './authentication';
import team from './team';

const helpers = new Helpers();
let pool = null;

const uid0 = 1234567890;

const user1 = {
  email: 'ccnuyan@qq.com',
  password: 'password',
};

const title0 = 'my team0';
const new_title = 'new title';
let user1ret = null;

let gret = null;

describe('team create', () => {
  before(async () => {
    pool = await helpers.initDb();
    return authentication.register(pool, user1).then((res) => {
      user1ret = res.rows[0];
      user1.id = user1ret.new_id;
    });
  });

  // USER 1

  describe('getting teams of a not-existed user', () => {
    let changeResult = null;
    before(() => {
      return team.get_created_teams(pool, {
        uid: uid0,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with no record', () => {
      assert.equal(0, changeResult.length);
    });
  });

  describe('getting teams of a brand new user', () => {
    let changeResult = null;
    before(() => {
      return team.get_created_teams(pool, {
        uid: user1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with no record', () => {
      assert.equal(0, changeResult.length);
    });
  });

  describe('USER1: creating team', () => {
    let changeResult = null;
    before(() => {
      return team.create_team(pool, {
        uid: user1.id,
        title: title0,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct team title', () => {
      assert.equal(title0, changeResult[0].title);
    });
  });

  describe('USER1: getting created teams', () => {
    let changeResult = null;
    before(() => {
      return team.get_created_teams(pool, {
        uid: user1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with 1 record', () => {
      assert.equal(1, changeResult.length);
    });
  });


  describe('USER1: getting teams', () => {
    let changeResult = null;
    before(() => {
      return team.get_created_teams(pool, {
        uid: user1.id,
      }).then((res) => {
        changeResult = res.rows;
        gret = res.rows;
      });
    });
    it('with 1 record', () => {
      assert.equal(1, changeResult.length);
    });
  });


  describe('update title', () => {
    let changeResult = null;
    before(() => {
      return team.update_team_title(pool, {
        uid: user1.id,
        id: gret[0].id,
        title: new_title,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct title', () => {
      assert.equal(new_title, changeResult[0].title);
    });
  });

  describe('USER1: get teams', () => {
    let changeResult = null;
    before(() => {
      return team.get_created_teams(pool, {
        uid: user1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('USER1: with 2 record', () => {
      assert.equal(1, changeResult.length);
    });
  });

  describe('delete all teams', () => {
    let changeResult = null;
    before(async () => {
      await Promise.all([
        team.delete_team(pool, {
          uid: user1.id,
          id: gret[0].id,
        }),
      ]);
      return team.get_created_teams(pool, {
        uid: user1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('user2 with 0 record', () => {
      assert.equal(0, changeResult.length);
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
