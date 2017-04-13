import { GraphQLObjectType } from 'graphql';
import ndf from '../nodeDefinitions';
import StoreType from './StoreType';

import dataService from '../dataService';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: ndf.nodeField,
    store: {
      type: StoreType,
      resolve: () => {
        return dataService.anonymousStore;
      },
    },
  }),
});

export default QueryType;
