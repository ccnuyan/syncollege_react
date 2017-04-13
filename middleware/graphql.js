import GraphQLHTTP from 'express-graphql';
import schema from '../schema/schema';

const loaders = {
};

export default (args) => {
  return (req, res) => {
    return GraphQLHTTP({
      schema,
      graphiql: true,
      formatError: (error) => {
        const formatted = {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack.split('\n') : null,
        };
        console.log(formatted);
        return formatted;
      },
      context: {
        loaders,
        req,
        res,
        ...args,
      },
    })(req, res);
  };
};
