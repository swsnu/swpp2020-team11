import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

class Main extends Component {
  render() {
    const onClickLogin = (values) => {
      this.props.onSignIn(values.email, values.password);
    };

    return (
      <div className="MainPage">
        <h1>SignIn</h1>
        <div className="Login">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onClickLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon" />
                }
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <a href="/sign_up/">register now!</a>
            </Form.Item>
          </Form>
        </div>
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
