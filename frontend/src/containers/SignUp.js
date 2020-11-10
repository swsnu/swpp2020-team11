import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { Form, Input, Tooltip, Checkbox, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import PersonalityCheckPopup from '../components/PersonalityCheckPopup';

class SignUp extends Component {
  state = {
    popupVisible: false,
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const onFinish = (values) => {
      this.props.onSignUp(values.email, values.nickname,
        values.password, values.phoneNumber)
        .then(() => {
          this.props.isLoggedIn ? popupControl() : null;
        });
    };

    const popupControl = () => {
      this.setState({ popupVisible: !this.state.popupVisible });
    };

    return (
      <div className="MainPage">
        <h1>SignUp</h1>
        <div className="SignUp">
          <Form
            {...formItemLayout}
            name="register"
            className="register-form"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="E-mail"
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
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="nickname"
              label={
                <span>
                  Nickname&nbsp;
                  <Tooltip title="What do you want others to call you?">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{
                required: true, message: 'Please input your nickname!', whitespace: true,
              }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Format: 010-XXXX-XXXX' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() :
                      Promise.reject(new Error('Should accept agreement')),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                I have read the agreement
                <Button className="agreement button"
                  onClick={() => this.props.history.push('/')}>
                  Click to read
                </Button>
              </Checkbox>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
          {this.props.isLoggedIn ? <PersonalityCheckPopup /> : null}
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.account.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUp: (email, nickname, password, phoneNumber) =>
      dispatch(actionCreators.signUp(email, nickname, password, phoneNumber)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));
