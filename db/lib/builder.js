import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import glob from 'glob';

import config from '../../package.json';
import { pg } from '../connector';

const versionRoot = config.version.replace(/\./g, '-');
const sourceDir = path.join(__dirname, '../sql/', versionRoot);

const loadFiles = () => {
  const globPattern = path.join(sourceDir, '**/*.sql');

  // use nosort to ensure that init.sql is loaded first
  const files = glob.sync(globPattern, {
    nosort: true,
  });
  const result = ['set search_path=membership;'];
  _.each(files, (file) => {
    const sql = fs.readFileSync(file, {
      encoding: 'utf-8',
    });
    result.push(sql);
  });
  return result.join('\r\n');
};


const decideSqlFile = () => {
  const buildDir = path.join(__dirname, '../build');
  const fileName = `${versionRoot}.sql`;
  return path.join(buildDir, fileName);
};

const readSql = () => {
  const sqlBits = loadFiles();
  // write it to file
  if (process.argv.indexOf('-w') < 0) {
    const sqlFile = decideSqlFile();
    fs.writeFileSync(sqlFile, sqlBits);
  }
  return sqlBits;
};

const install = () => {
  const sqlFile = decideSqlFile();
  const sql = fs.readFileSync(sqlFile, {
    encoding: 'utf-8',
  });
  return pg.query(sql).then((res) => {
    console.log(res.rows[0].result); // eslint-disable-line
    process.exit(0);
  });
};

export default {
  readSql,
  install,
};

