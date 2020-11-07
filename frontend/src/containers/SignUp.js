import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';

class Main extends Component {
  render() {
    return (
      <div className="MainPage">
        <h1>SignUp</h1>
        <div className="SignUp">
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUp: (email, nickname, password, phoneNumber) =>
      dispatch(actionCreators.signUp(email, nickname, password, phoneNumber)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Main));
