import assert from 'assert';
import Helpers from './helpers';
import authentication from './authentication';

const helpers = new Helpers();
let pool = null;

describe('changing roles', () => {
  before(async () => {
    pool = await helpers.initDb();
    return authentication.register(pool, {
      email: 'test@test.com',
      password: 'password',
    });
  });
  describe('adding to admin', () => {
    let changeResult = null;
    before(() => {
      return authentication.add_user_to_role(pool, {
        email: 'test@test.com',
        role: 10,
      }).then((res) => {
        changeResult = res.rows[0];
      });
    });
    it('makes them an admin', () => {
      assert(changeResult.is_admin);
    });
  });
  describe('removing from admin', () => {
    let changeResult = null;
    before(() => {
      return authentication.remove_user_from_role(pool, {
        email: 'test@test.com',
        role: 10,
      }).then((res) => {
        changeResult = res.rows[0];
      });
    });
    it('makes them an admin', () => {
      assert.equal(false, changeResult.is_admin);
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
