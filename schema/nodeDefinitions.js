import { nodeDefinitions } from 'graphql-relay';
import { getNode, getNodeType } from './typeRegistry';

const { nodeInterface, nodeField } = nodeDefinitions(getNode, getNodeType);

export default {
  nodeInterface,
  nodeField,
};
