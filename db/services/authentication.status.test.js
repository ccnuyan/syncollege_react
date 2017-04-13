import assert from 'assert';
import Helpers from './helpers';
import authentication from './authentication';

const helpers = new Helpers();
let pool = null;

describe('status changes', () => {
  before(async () => {
    pool = await helpers.initDb();
    return authentication.register(pool, {
      email: 'ccnuyan@qq.com',
      password: 'password',
    });
  });
  describe('suspension', () => {
    let statResult = null;
    before(() => {
      return authentication.suspend_user(pool, {
        email: 'ccnuyan@qq.com',
        reason: 'Testing',
      }).then((res) => {
        statResult = res.rows[0];
      });
    });
    it('suspends the user', () => {
      assert.equal(statResult.status, 'Suspended');
    });
    it('they cannot login', () => {
      assert.equal(statResult.can_login, false);
    });
  });
  describe('locking out', () => {
    let statResult = null;
    before(() => {
      return authentication.lock_user(pool, {
        email: 'ccnuyan@qq.com',
        reason: 'Testing',
      }).then((res) => {
        statResult = res.rows[0];
      });
    });
    it('Locks the user', () => {
      assert.equal(statResult.status, 'Locked');
    });
    it('they cannot login', () => {
      assert.equal(statResult.can_login, false);
    });
  });
  describe('banning', () => {
    let statResult = null;
    before(() => {
      return authentication.ban_user(pool, {
        email: 'ccnuyan@qq.com',
        reason: 'Testing',
      }).then((res) => {
        statResult = res.rows[0];
      });
    });
    it('Bans the user', () => {
      assert.equal(statResult.status, 'Banned');
    });
    it('they cannot login', () => {
      assert.equal(statResult.can_login, false);
    });
  });
  describe('activation', () => {
    let statResult = null;
    before(() => {
      return authentication.activate_user(pool, {
        email: 'ccnuyan@qq.com',
        reason: 'Testing',
      }).then((res) => {
        statResult = res.rows[0];
      });
    });
    it('Activates the user', () => {
      assert.equal(statResult.status, 'Active');
    });
    it('they can login', () => {
      assert(statResult.can_login);
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
