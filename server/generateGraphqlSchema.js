import fs from 'fs';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import { graphql } from 'graphql';
import schema from '../schema/schema';

export default async () => {
  const json = await graphql(schema, introspectionQuery);

  // generate schema.json
  fs.writeFile('./schema.json', JSON.stringify(json, null, 2), (err) => {
    if (err) throw err;
    console.log('json schema created'); // eslint-disable-line no-console
  });

  // generate schema.graphql
  fs.writeFile('./schema.graphql', printSchema(schema), (err) => {
    if (err) throw err;
    console.log('graphql schema created'); // eslint-disable-line no-console
  });
};
