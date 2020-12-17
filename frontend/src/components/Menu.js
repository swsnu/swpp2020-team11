import React, { Component } from 'react';
import { Menu, Button } from 'antd';
import { history } from '../store/store';
import './Menu.css';
import * as actionCreators from '../store/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class UserMenu extends Component {
  render() {
    return (
      <Menu className="user-menu">
        <Menu.Item>
          <Button
            className="user-menu-button"
            onClick={ () => history.push('/plan/history') }
          >
            History
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            className="user-menu-button"
            onClick={ () => history.push('/personality_check') }
          >
            Personality Check
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            className="user-menu-button"
            onClick={ () => history.push('/suggest') }
          >
            Suggest Place
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            className="user-menu-button"
            type="primary"
            onClick={ this.props.onSignOut }
          >
            Log Out
          </Button>
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.account.isLoggedIn,
    user: state.account.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: () => dispatch(actionCreators.signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserMenu));
