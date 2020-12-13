import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './SignIn.css';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
  };

  render() {
    const onClickLogin = () => {
      this.props.onSignIn(this.state.email, this.state.password);
    };

    const handleEmail = (event) => {
      this.setState({ email: event.target.value });
    };

    const handlePassword = (event) => {
      this.setState({ password: event.target.value });
    };

    return (
      <div id = "SignIn" className="SignIn">
        <div id = "topBox"></div>
        <div id = "topBar">
          <h1>SignIn</h1>
        </div>
        <div id = "midBox2"></div>
        <div id = "LogIn2" className="Login">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input
                className="email-input"
                prefix={
                  <UserOutlined className="site-form-item-icon" />
                }
                placeholder="Email"
                value={this.state.email}
                onChange={handleEmail}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input Password!' }]}
            >
              <Input
                className="password-input"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={handlePassword}
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Button className="login-form-forgot"
                onClick={() => this.props.history.push('/')}>
                Forgot password
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit"
                className="login-form-button" onClick={onClickLogin}>
                Log in
              </Button>
              <Button className="signup-button"
                onClick={() => this.props.history.push('/sign_up/')}>
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (email, password) => dispatch(actionCreators.signIn(email, password)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(SignIn));
