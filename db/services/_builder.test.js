import assert from 'assert';
import builder from '../lib/builder';
import Helpers from './helpers';

const helper = new Helpers();

describe('SQL Builder', () => {
  before(async () => {
    await helper.initDb();
  });
  it('loads', () => {
    assert(builder);
  });
  describe('loading sql', () => {
    it('returns a sql string', () => {
      const sql = builder.readSql();
      assert(sql);
    });
  });
});
