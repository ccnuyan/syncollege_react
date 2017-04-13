import assert from 'assert';
import Helpers from './helpers';
import authentication from './authentication';

const helpers = new Helpers();
let pool = null;
let registeredUser = null;

describe('authentication', () => {
  before(async () => {
    pool = await helpers.initDb();
    return authentication.register(pool, {
      email: 'ccnuyan@qq.com',
      password: 'password',
    }).then((res) => {
      registeredUser = res.rows[0];
    });
  });

  describe('with a valid login', () => {
    let authResult = null;
    before(() => {
      return authentication.authentiacate(pool, {
        email: 'ccnuyan@qq.com',
        password: 'password',
      }).then((res) => {
        authResult = res.rows[0];
      });
    });
    it('is successful', () => {
      assert(authResult.success);
    });
  });
  describe('with a valid token', () => {
    let authResult = null;
    before(() => {
      return authentication.authenticate_by_token(pool, {
        token: registeredUser.authentication_token,
      }).then((res) => {
        authResult = res.rows[0];
      });
    });
    it('is successful', () => {
      assert(authResult.success);
    });
  });
  describe('invalid login', () => {
    let authResult = null;
    before(() => {
      return authentication.authentiacate(pool, {
        email: 'ccnuyan@qq.com',
        password: 'password1',
      }).then((res) => {
        authResult = res.rows[0];
      });
    });
    it('is not successful', () => {
      assert.equal(false, authResult.success);
    });
  });
  describe('locked out', () => {
    registeredUser = null;
    let authResult = null;
    before(async () => {
      await authentication.register(pool, {
        email: 'test@test.com',
        password: 'password',
      }).then((res) => {
        registeredUser = res.rows[0];
      });
      await authentication.lock_out(pool, {
        id: registeredUser.new_id,
      });
      return authentication.authentiacate(pool, {
        email: 'test@test.com',
        password: 'password',
      }).then((res) => {
        authResult = res.rows[0];
      });
    });
    it('will fail', () => {
      assert.equal(authResult.success, false);
    });
    it('states that user is locked out', () => {
      assert.equal(authResult.message, 'This user is currently locked out');
    });
  });
});


describe('registration', () => {
  before(async () => {
    await helpers.initDb();
  });
  describe('with valid creds', () => {
    let regResult = null;
    before(() => {
      return authentication.register(pool, {
        email: 'test@test.com',
        password: 'password',
      }).then((res) => {
        regResult = res.rows[0];
      });
    });
    it('is successful', () => {
      assert(regResult.success);
    });
    it('returns a new id', () => {
      assert(regResult.new_id);
    });
    it('returns a validation token', () => {
      assert(regResult.validation_token);
    });
    it('adds them to a role', () => {
      return pool.query(`select count(1) from membership.users_roles where user_id=${regResult.new_id}`)
        .then((res) => {
          assert.equal(res.rows[0].count, 1);
        });
    });
  });
  describe('trying an existing user', () => {
    let regResult = null;
    before(() => {
      return authentication.register(pool, {
        email: 'test@test.com',
        password: 'password',
      }).then((res) => {
        regResult = res.rows[0];
      });
    });
    it('is not successful', () => {
      assert.equal(false, regResult.success);
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
