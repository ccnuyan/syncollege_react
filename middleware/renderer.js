import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Index from './html';

export default (req, res) => {
  const content = `<!doctype html>${ReactDOMServer.renderToStaticMarkup(<Index />)}`;
  res.type('.html');
  res.send(content);
};
