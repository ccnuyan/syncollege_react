import _ from 'lodash';

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  orderedFor: (rows, collection, field, singleObject) => {
    // return the rows ordered for the collection
    const data = rows;
    const inGroupsOfField = _.groupBy(data, field);
    return collection.map((element) => {
      const elementArray = inGroupsOfField[element];
      if (elementArray) {
        return singleObject ? elementArray[0] : elementArray;
      }
      return singleObject ? {} : [];
    });
  },
  slug: str => str.toLowerCase().replace(/[\s\W-]+/, '-'),
};
