import { fromGlobalId } from 'graphql-relay';

export const types = {};

export const registerType = (model, type, lookupFn) => {
  types[type.name] = {
    type,
    model,
    lookupFn,
  };
};

export const getNode = (globalId) => {
  const {type: typeName, id} = fromGlobalId(globalId);
  if (types[typeName]) {
    return types[typeName].lookupFn(id);
  }
  return null;
};

export const getNodeType = (obj) => {
  for (const typeName of Object.keys(types)) { // eslint-disable-line
    if (obj instanceof types[typeName].model) {
      return types[typeName].type;
    }
  }
  return null;
};
