import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';

class Main extends Component {
  render() {
    return (
      <div className="MainPage">
        <h1>SignIn</h1>
        <button onClick={() => this.props.onSignIn('dummy', 'dummy')}>sign in</button>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (email, password) => dispatch(actionCreators.signIn(email, password)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Main));
