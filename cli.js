#!/usr/bin/env node

const { exec } = require('child_process');
const chrono = require('chrono-node');
const moment = require('moment');

const [, , ...args] = process.argv;

const index = args.findIndex(e => e === '-d' || e === '--date');

if(index > -1) {

  // Checks that the next value can be parsed as a date
  const chronoDate = chrono.parseDate(args[index + 1]);

  if (chronoDate) {
    args.splice(index, 2);
  } else {
    return process.stderr.write('You must specify a valid date value to parse after -d or --date');
  }

  if (args.findIndex(e => e === '-d' || e === '--date') > -1) {
    return process.stderr.write('Please ensure you only specify the -d or --date options once');
  }

  // Set the environment variables

  const date = new Date(chronoDate);
  const unixTimestampInSeconds = date.getTime() / 1000;
  const rfc2822TzOffset = moment(date).format('ZZ');
  const gitDateString = `@${unixTimestampInSeconds} ${rfc2822TzOffset}`;

  process.env.GIT_AUTHOR_DATE = gitDateString;
  process.env.GIT_COMMITTER_DATE = gitDateString;
}

// Recreates the functionality of git commit
function escapeStr(arg) {
  return arg
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\$/g, "\\\$")
    .replace(/`/g, "\\\`")
}

const quotedArgs = args.map(arg => arg.includes(' ') ? `"${escapeStr(arg)}"` : arg);
const command = `git commit ${quotedArgs.join(' ')}`;

// Run the git commit command

exec(command, {
  cwd: process.env.PWD,
  env: process.env
}, (error, stdout, stderr) => {
  process.stdout.write(stdout);
  if (error) {
    process.stderr.write(stderr);
  }
});
