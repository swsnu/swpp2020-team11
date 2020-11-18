import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { Form, Input, Tooltip, Button, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    nickname: '',
    phoneNumber: '',
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

    const handleEmail = (event) => {
      this.setState({ email: event.target.value });
    };

    const handlePassword = (event) => {
      this.setState({ password: event.target.value });
    };

    const handleNickname = (event) => {
      this.setState({ nickname: event.target.value });
    };

    const handlePhoneNumber = (event) => {
      this.setState({ phoneNumber: event.target.value });
    };

    const handleConfirm = () => {
      this.props.onSignUp(this.state.email, this.state.nickname,
        this.state.password, this.state.phoneNumber);
    };

    return (
      <div className="SignUpPage">
        <h1>SignUp</h1>
        <div className="SignUp">
          <Form
            {...formItemLayout}
            name="register"
            className="register-form"
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
              <Input
                className="email-input"
                value={this.state.email}
                onChange={handleEmail}
              />
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
              <Input.Password
                className="password-input"
                value={this.state.password}
                onChange={handlePassword}
              />
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
              <Input
                className="nickname-input"
                value={this.state.nickname}
                onChange={handleNickname}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Format: 010-XXXX-XXXX' }]}
            >
              <Input
                className="phoneNumber-input"
                value={this.state.phoneNumber}
                onChange={handlePhoneNumber}
              />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" className="signup-form-button"
                onClick={handleConfirm}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <Modal
            title="Would you take a personality check?"
            visible={ this.props.popUpVisible }
            closable={ true }
            onCancel={ () => this.props.history.push('/') }
            footer={ [
              <Button
                className="no-button"
                key="main-page"
                onClick={ () => this.props.history.push('/') }
              >
                No
              </Button>,
              <Button
                className="yes-button"
                key="personality-check"
                type="primary"
                onClick={ () => this.props.history.push('/') }
              >
                Yes
              </Button>,
            ] }
          >
            <p>This process helps better recommendation.</p>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    popUpVisible: state.account.popUpVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUp: (email, nickname, password, phoneNumber) =>
      dispatch(actionCreators.signUp(email, nickname, password, phoneNumber)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));
