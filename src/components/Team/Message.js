import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import SvgIconFace from 'material-ui/svg-icons/action/face';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; //eslint-disable-line

import withStyles from '../Providers/StylesProvider';

class Message extends Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    self: PropTypes.bool.isRequired,
  }

  getStyles = () => {
    const { styles, theme, self } = this.props;

    return {
      message: {
        padding: '0.5em',
        ...styles.flexColumn,
        ...styles.flexStretch,
        margin: '0.5em',
        marginLeft: self ? '5em' : '0.5em',
        marginRight: self ? '0.5em' : '3em',
        border: `0.1em solid ${theme.palette.borderColor}`,
        borderRadius: '1em',
        backgroundColor: theme.palette.clockCircleColor,
        flex: '0 0 auto',
      },
      selfChip: {
        alignSelf: 'flex-end',
      },
      nonSelfChip: {
        alignSelf: 'flex-start',
      },
    };
  }

  render() {
    const { entry } = this.props;

    const styles = this.getStyles();

    return (
      <div style={ styles.message }>
        <Chip style={ this.props.self ? styles.selfChip : styles.nonSelfChip }>
          <Avatar icon={ <SvgIconFace/> }/>
          <div>
            {entry.created_by.email}
          </div>
        </Chip>
        <div>
          {entry.content}
        </div>
      </div>
    );
  }
}

export default withStyles(Message);
