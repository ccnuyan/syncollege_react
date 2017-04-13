import _ from 'lodash';
import assert from 'assert';
import Helpers from './helpers';
import authentication from './authentication';
import team from './team';

const helpers = new Helpers();
let pool = null;


const user1 = {
  email: 'ccnuyan@qq.com',
  password: 'password',
};
const user2 = {
  email: 'ccnuyan@pp.net',
  password: 'password',
};

const title1 = 'my team1';
const title2 = 'my team2';
let changeResult1 = null;
let changeResult2 = null;
let ret1 = null;
let ret2 = null;
let user1ret = null;
let user2ret = null;

describe('team join', () => {
  before(async () => {
    pool = await helpers.initDb();
    return Promise.all([
      authentication.register(pool, user1).then((res) => {
        user1ret = res.rows[0];
        user1.id = user1ret.new_id;
      }),
      authentication.register(pool, user2).then((res) => {
        user2ret = res.rows[0];
        user2.id = user2ret.new_id;
      })]);
  });

  describe('USER2: creating two teams', () => {
    before(async () => {
      return Promise.all([
        team.create_team(pool, {
          uid: user2.id,
          title: title1,
        }).then((res) => {
          changeResult1 = res.rows[0];
        }),
        team.create_team(pool, {
          uid: user2.id,
          title: title2,
        }).then((res) => {
          changeResult2 = res.rows[0];
        }),
      ]).catch(err => console.log(err));
    });

    it('with correct team title', () => {
      assert.equal(title1, changeResult1.title);
      assert.equal(title2, changeResult2.title);
    });

    describe('USER2: getting team by id', () => {
      before(async () => {
        return team.get_team_by_id(pool, {
          id: changeResult1.id,
        }).then((res) => {
          changeResult1 = res.rows[0];
        });
      });
      it('with correct team title1', () => {
        assert.equal(title1, changeResult1.title);
      });

      before(async () => {
        return team.get_team_by_id(pool, {
          id: changeResult2.id,
        }).then((res) => {
          changeResult2 = res.rows[0];
        });
      });
      it('with correct team title2', () => {
        assert.equal(title2, changeResult2.title);
      });
    });
    describe('USER2: getting teams by ids', () => {
      let changeResult = null;

      before(async () => {
        return team.get_teams_by_ids(pool, {
          ids: [changeResult1.id, changeResult2.id],
        }).then((res) => {
          changeResult = res.rows;
        });
      });
      it('with correct team titles', () => {
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

      describe('USER2: getting joined_teams', () => {
        changeResult = null;

        before(async () => {
          return team.get_joined_teams(pool, {
            uid: user2.id,
          }).then((res) => {
            changeResult = res.rows;
          });
        });
        it('with correct team titles', () => {
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

  describe('USER1: joining user 2 team 1', () => {
    let changeResult = null;

    before(async () => {
      return team.join_team(pool, {
        uid: user1.id,
        id: ret1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct team title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret1.title, changeResult[0].title);
    });

    describe('USER1: getting joined_teams again', () => {
      before(async () => {
        return team.get_joined_teams(pool, {
          uid: user1.id,
        }).then((res) => {
          changeResult = res.rows;
        });
      });

      it('with correct team title', () => {
        assert.equal(1, changeResult.length);
        ret1 = _.find(changeResult, (it) => {
          return it.title === title1;
        });
        assert.notEqual(null, ret1);
      });
    });
  });

  describe('USER1: joining user 2 team 2', () => {
    let changeResult = null;

    before(async () => {
      return team.join_team(pool, {
        uid: user1.id,
        id: ret2.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct team title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret2.title, changeResult[0].title);
    });

    describe('USER1: getting joined_teams again', () => {
      before(async () => {
        return team.get_joined_teams(pool, {
          uid: user1.id,
        }).then((res) => {
          changeResult = res.rows;
        });
      });

      it('with 2 correct teams', () => {
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

  describe('USER1: exit user 2 team 1', () => {
    let changeResult = null;

    before(async () => {
      return team.exit_team(pool, {
        uid: user1.id,
        id: ret1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct team title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret1.title, changeResult[0].title);
    });
  });

  describe('USER1: exit user 2 team 2', () => {
    let changeResult = null;

    before(async () => {
      return team.exit_team(pool, {
        uid: user1.id,
        id: ret2.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });
    it('with correct team title', () => {
      assert.equal(1, changeResult.length);
      assert.equal(ret2.title, changeResult[0].title);
    });
  });

  describe('USER1: getting joined_teams again', () => {
    let changeResult = null;

    before(async () => {
      return team.get_joined_teams(pool, {
        uid: user1.id,
      }).then((res) => {
        changeResult = res.rows;
      });
    });

    it('with 0 correct teams', () => {
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
