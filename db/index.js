import program from 'commander';
import builder from './lib/builder';
/* eslint-disable no-console */

/* rotate the console. */
const lines = process.stdout.getWindowSize()[1];
for (let i = 0; i < lines; i += 1) {
  console.log('\r\n');
}
/* rotate the console. */

program
  .command('build')
  .description('Build the sql file for our project')
  .action(() => {
    console.log('building now...');
    builder.readSql();
    console.log('sql script file created');
  });

program
  .command('install')
  .description('build the SQL file for our project')
  .action(async () => {
    console.log('installing');
    await builder.install();
    console.log('done');
  });

program
  .command('bi')
  .description('building and installing the sQL files for our project')
  .action(async () => {
    builder.readSql();
    await builder.install().catch(err => console.log(err));
    console.log('success');
  });

/* eslint-disable no-console */
program.parse(process.argv);
