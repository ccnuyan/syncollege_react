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
  .description('Build the SQL files for our project')
  .action(() => {
    console.log('Building now...');
    builder.readSql();
    console.log('File created');
  });

program
  .command('install')
  .description('Build the SQL files for our project')
  .action(async () => {
    console.log('Installing');
    await builder.install();
    console.log('done');
  });

program
  .command('bi')
  .description('Building and Installing the SQL files for our project')
  .action(async () => {
    builder.readSql();
    await builder.install().catch(err => console.log(err));
    console.log('Success');
  });

/* eslint-disable no-console */
program.parse(process.argv);
