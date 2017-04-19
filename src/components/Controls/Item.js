import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import { ListItem } from 'material-ui/List';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; // eslint-disable-line

import withStyles from '../Providers/StylesProvider';

class Item extends Component {

  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    onEnter: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    titlePath: PropTypes.string.isRequired,
    active: PropTypes.bool,
  }

  state = {
    open: false,
    mode: 'plain',
  }

  onUpdate = () => {
    const inputTitle = this.unInput.input.value;
    this.onPlain();
    if (!_.trim(inputTitle)) {
      return;
    }
    this.props.onUpdate(inputTitle);
  }

  onEnter = (event) => {
    event.preventDefault();
    this.props.onEnter();
  }

  onDelete = (event) => {
    this.handleRequestClose();
    event.preventDefault();
    this.props.onDelete();
  }

  onEdit = () => {
    this.handleRequestClose();
    this.setState({
      mode: 'editing',
    });
    _.delay(() => this.unInput.focus(), 200, 'later');
  }

  onCancel = () => {
    this.handleRequestClose();
  }


  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  onBlur = () => {
    _.delay(this.onPlain, 300, 'later');
  }

  onPlain = () => {
    this.setState({
      mode: 'plain',
    });
  }

  getStyles = () => {
    const { styles } = this.props;

    return {
      active: styles.active,
      palin: styles.plain,
      iconMenu: {
      },
      input: {
        width: 'auto',
      },
    };
  }

  block = (event) => {
    event.stopPropagation();
  }

  render = () => {
    const styles = this.getStyles();

    const primaryText = this.state.mode === 'editing' ?
      (
        <TextField
          hintText="new title"
          onBlur={ this.onBlur }
          onTouchTap={ this.block }
          ref={ c => this.unInput = c }
          style={ styles.input }
          type="text"
        />) :
      (
        <div ref={ c => this.title = c }>
          {`${this.props.model[this.props.titlePath]}`}
        </div>);

    const iconButtonElement = (
      <IconButton
        tooltip="options"
        tooltipPosition="top-center"
      >
        <MoreVertIcon />
      </IconButton>);

    const rightIcon = this.state.mode === 'editing' ?
      (
        <IconButton tooltip="confirm">
          <CheckIcon onTouchTap={ this.onUpdate } />
        </IconButton>) :
      (
        <IconMenu
          anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
          iconButtonElement={ iconButtonElement }
          style={ styles.iconMenu }
          targetOrigin={ { horizontal: 'right', vertical: 'top' } }
        >
          <MenuItem
            onTouchTap={ this.onEdit }
            primaryText="Edit"
          />
          <MenuItem
            onTouchTap={ this.onDelete }
            primaryText="Delete"
          />
          <Divider />
          <MenuItem
            onTouchTap={ this.onCancel }
            primaryText="Cancel"
          />
        </IconMenu>);

    return (
      <ListItem
        onTouchTap={ this.onEnter }
        primaryText={ primaryText }
        ref={ c => this.root = c }
        rightIconButton={ rightIcon }
        style={ this.props.active && this.state.mode !== 'editing' ? styles.active : styles.plain }
      />
    );
  }
}

export default withStyles(Item);
