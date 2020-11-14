import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import UserMenu from '../components/Menu';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Image, Row, Col } from 'antd';
import logoImg from '../assets/img/logo.png';
import './Header.css';
import * as actionCreators from '../store/actions/index';

class Header extends Component {
  componentDidMount() {
    this.props.onSetAccount();
  }

  render() {
    return (
      <Row align="middle">
        <Col span={ 6 } offset={ 9 }>
          <Image
            className="logoImage"
            width="150px"
            src={ logoImg }
            preview={ false }
            onClick={ () => this.props.history.push('/') }
          />
        </Col>
        <Col span={ 1 } offset={ 6 }>
          { this.props.isLoggedIn === false ?
            <LoginOutlined
              className='user-icon'
              onClick={ () => this.props.history.push('/sign_in') }
            /> :
            <Dropdown
              overlay={ <UserMenu/> }
              placement="bottomRight"
            >
              <UserOutlined className='user-icon'/>
            </Dropdown>
          }
        </Col>
      </Row>
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
    onSetAccount: () => dispatch(actionCreators.checkAccount()),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
