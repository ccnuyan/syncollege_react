import React, { Component, PropTypes } from 'react'; //eslint-disable-line
import Paper from 'material-ui/Paper';

import StylesProvider from '../Providers/StylesProvider';

const styles = {
  paper: {
    padding: '3em',
  },
};

class Slogan extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
  }
  render() {
    return (
      <Paper
          style={styles.paper}
          zDepth={2}>
          <div>
              <h1>Great!</h1>
              <p>
                  Whatever work means for you. Slack brings all the pieces get things done.
              </p>
              {this.props.children}
          </div>
      </Paper>
      );
  }
}

export default StylesProvider(Slogan);
