// https://facebook.github.io/relay/docs/guides-babel-plugin.html

// es6 not supported for this file

/* eslint-disable */

const getBabelRelayPlugin = require('babel-relay-plugin');
const fs = require('fs');
const path = require('path');

let schemastr = fs.readFileSync(path.join(__dirname, '../../schema/schema.json'));

const refreshSchema = () => {
  const newSchemastr = fs.readFileSync(path.join(__dirname, '../../schema/schema.json'));
  schemastr = newSchemastr;
  console.log('************************* schema reloaded *************************');
  return JSON.parse(schemastr).data;
};

module.exports = getBabelRelayPlugin(refreshSchema());
