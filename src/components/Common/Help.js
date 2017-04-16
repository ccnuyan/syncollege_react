import React, { Component } from 'react';

import Links from '../../../links.md';

/* eslint-disable react/no-danger */

class Help extends Component {
  render = () => {
    return (
      <div>
        <div dangerouslySetInnerHTML={ { __html: Links } }/>
      </div>);
  }
}
/* eslint-disable react/no-danger */

export default Help;
