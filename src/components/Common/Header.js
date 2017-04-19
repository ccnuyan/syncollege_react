import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { withRouter } from 'react-router';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; // eslint-disable-line
import { clearToken } from '../../core/util';
import m from '../Mutations';

class Header extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
  }

  state = {
    open: false,
  }

  onLogout = () => {
    clearToken();
    const store = this.props.store;
    const loginInfo = this.props.store.loginInfo;

    Relay.Store.commitUpdate(new m.LocalLoginMutation({
      store,
      loginInfo,
      credential: {
        email: 'anonymous',
        password: '',
        mode: 'logout',
      },
    }));
    this.props.router.push('/');
  }

  List = () => (
    <ToolbarGroup>
      <IconMenu
        anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
        iconButtonElement={ <IconButton>
          <MoreVertIcon />
        </IconButton> }
        targetOrigin={ { horizontal: 'right', vertical: 'top' } }
      >
        <MenuItem
          onTouchTap={ () => this.props.router.push('/home') }
          primaryText="Home"
        />
        <MenuItem
          onTouchTap={ () => this.props.router.push('/register') }
          primaryText="Register"
        />
        <MenuItem
          onTouchTap={ () => this.props.router.push('/help') }
          primaryText="Help"
        />
        <MenuItem
          onTouchTap={ this.onLogout }
          primaryText="Sign out"
        />
      </IconMenu>
    </ToolbarGroup>
  );

  handleChange = (event, value) => {
    window.localStorage.setItem('mui_theme', value);
    window.location.reload(true);
  };

  handleTouchTap = (event) => {
    // This prevents ghost click.
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

  Listed = () => {
    const loginInfo = this.props.store.loginInfo;
    return (<ToolbarGroup>
      <FlatButton
        label={ `Theme: ${window.localStorage.getItem('mui_theme') === 'darkBaseTheme' ? 'Dark' : 'Light'}` }
        onTouchTap={ this.handleTouchTap }
      >
        <Popover
          anchorEl={ this.state.anchorEl }
          anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } }
          onRequestClose={ this.handleRequestClose }
          open={ this.state.open }
          targetOrigin={ { horizontal: 'left', vertical: 'top' } }
        >
          <Menu onChange={ this.handleChange }>
            <MenuItem
              primaryText="Light"
              value={ 'lightBaseTheme' }
            />
            <MenuItem
              primaryText="Dark"
              value={ 'darkBaseTheme' }
            />
          </Menu>
        </Popover>
      </FlatButton>
      <IconMenu iconButtonElement={ <IconButton touch>
        <NavigationExpandMoreIcon />
      </IconButton> }
      >
        {loginInfo.success ? <FlatButton label={ loginInfo.display_name } /> : ''}
        {!loginInfo.success ? (
          <FlatButton
            label="Register"
            onTouchTap={ () => this.props.router.push('/register') }
          />) : ''}
        <MenuItem
          onTouchTap={ () => this.props.router.push('/help') }
          primaryText="Help"
        />
        {loginInfo.success ? <Divider /> : ''}
        {loginInfo.success ? (
          <MenuItem
            onTouchTap={ this.onLogout }
            primaryText="Sign out"
          />) : ''}
      </IconMenu>
    </ToolbarGroup>);
  };

  Stacked = () => {
    const loginInfo = this.props.store.loginInfo;
    return (<ToolbarGroup>
      <FlatButton
        label={ `Theme: ${window.localStorage.getItem('mui_theme') === 'darkBaseTheme' ? 'Dark' : 'Light'}` }
        onTouchTap={ this.handleTouchTap }
      >
        <Popover
          anchorEl={ this.state.anchorEl }
          anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } }
          onRequestClose={ this.handleRequestClose }
          open={ this.state.open }
          targetOrigin={ { horizontal: 'left', vertical: 'top' } }
        >
          <Menu onChange={ this.handleChange }>
            <MenuItem
              primaryText="Light"
              value={ 'lightBaseTheme' }
            />
            <MenuItem
              primaryText="Dark"
              value={ 'darkBaseTheme' }
            />
          </Menu>
        </Popover>
      </FlatButton>
      {loginInfo.success ? <FlatButton label={ loginInfo.display_name } /> : ''}
      {!loginInfo.success ? (
        <FlatButton
          label="Register"
          onTouchTap={ () => this.props.router.push('/register') }
        />) : ''}
      {loginInfo.success ? (
        <FlatButton
          label="Sign out"
          onTouchTap={ this.onLogout }
        />) : ''}
      <FlatButton
        label="Help"
        onTouchTap={ () => this.props.router.push('/help') }
      />
    </ToolbarGroup>);
  };

  render() {
    const { loginInfo, activeTeam } = this.props.store;
    const { width, router } = this.props;
    return (
      <Toolbar>
        <ToolbarGroup firstChild>
          <ToolbarTitle
            onTouchTap={ () => router.push('/home') }
            text={ loginInfo.success && activeTeam.teamDetail.title ? `Syncollege.${activeTeam.teamDetail.title}` : 'Syncollege' }
          />
        </ToolbarGroup>
        {width === MEDIUM ? this.Listed() : this.Stacked()}
      </Toolbar>);
  }
}

Header = Relay.createContainer(withRouter(withWidth()(Header)), { //eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store{
        ${m.LocalLoginMutation.getFragment('store')}
        loginInfo {
          ${m.LocalLoginMutation.getFragment('loginInfo')}
          success
          message
          display_name
        }      
        activeTeam{
          teamDetail{
            title
          }
        }
      }
    `,
  },
});

export default Header;
