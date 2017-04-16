import assert from 'assert';
import Helpers from './helpers';
import authentication from './authentication';

const helpers = new Helpers();
let pool = null;

describe('changing a password', () => {
  before(async () => {
    pool = await helpers.initDb();
  });
  describe('with a valid old password', () => {
    let changeResult = null;
    before(() => {
      return authentication.change_password(pool, {
        email: 'test@test.com',
        password: 'password',
        new_passwrod: 'new-password',
      }).then((res) => {
        changeResult = res;
      });
    });
    it('changes and returns the user', () => {
      assert(changeResult);
    });
  });
});

describe('profile', () => {
  before(async () => {
    pool = await helpers.initDb();
    return authentication.register(pool, {
      email: 'ccnuyan@qq.com',
      password: 'password',
    });
  });
  describe('updating nickname', () => {
    let changeResult = null;
    before(() => {
      return authentication.update_user(pool, {
        email: 'ccnuyan@qq.com',
        nickname: 'ccnuya',
        body: {
          twitter: 'wolegeca',
        },
      }).then((res) => {
        changeResult = res.rows[0];
      });
    });
    it('sets the display name to ccnuya', () => {
      assert.equal('ccnuya', changeResult.display_name);
    });
    it('sets the profile twitter to wolegeca', () => {
      assert.equal('wolegeca', changeResult.profile.twitter);
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
