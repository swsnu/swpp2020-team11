import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';

class Header extends Component {
  render() {
    return (
      <div className="MainPage">
        <div
          onClick={() => this.props.history.push('/')}
        >
          AsapGo
        </div>
        { this.props.isLoggedIn === false ?
          <LoginOutlined
            onClick={() => this.props.history.push('/sign_in')}
          /> :
          <UserOutlined
            onClick={this.props.onSignOut}
          />
        }
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.account.isLoggedIn,
    user: state.account.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: () => dispatch(actionCreators.signIn()),
    onSignOut: () => dispatch(actionCreators.signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
