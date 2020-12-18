import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Button, Modal, Typography, InputNumber, Image, Space } from 'antd';
import normalImg from '../assets/img/normal_trip_main.png';
import normalHoverImg from '../assets/img/normal_trip_main_hover.png';
import specialImg from '../assets/img/special_trip_main.png';
import specialHoverImg from '../assets/img/special_trip_main_hover.png';
import manicImg from '../assets/img/maniac_trip_main.png';
import manicHoverImg from '../assets/img/maniac_trip_main_hover.png';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import './MainPage.css';

const { Text } = Typography;

class MainPage extends Component {
  state = {
    headCount: 2,
    popUpVisible: false,
  }

  showPopUp() {
    this.setState({
      popUpVisible: true,
    });
  };

  handleSignUp() {
    this.props.history.push('/sign_up');
  };

  handleSignIn() {
    this.props.history.push('/sign_in');
  }

  handleCancel() {
    this.setState({
      popUpVisible: false,
    });
  };

  onGetPlan(level) {
    if (navigator.geolocation) { // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.props.onGetPlan(level, this.state.headCount, position.coords.latitude, position.coords.longitude);
        }, function(error) {
          console.log(error);
        }, {
          enableHighAccuracy: false,
          maximumAge: 15000,
          timeout: 15000,
        });
    } else {
      console.log('GPS를 지원하지 않습니다');
    }
  }

  mainImage(hoverImg, img, level) {
    return (
      <Image
        src={ img }
        preview={ false }
        width="350px"
        className="main-image"
        onMouseOver={ (e) => (e.target.src = hoverImg) }
        onMouseOut={ (e) => (e.target.src = img) }
        onClick={ () => {
          this.props.isLoggedIn ?
            this.onGetPlan(level) :
            this.showPopUp();
        } }
      />
    );
  }

  inputNumber() {
    return <InputNumber
      style={ {
        border: 'None',
        fontSize: '18px',
        width: '60px',
        height: '30px',
      } }
      className="head-count-input"
      min={ 1 }
      max={ 10 }
      defaultValue={ 2 }
      onChange={ (e) => this.setState({ headCount: e }) }
    />;
  }

  modal() {
    return <Modal
      title="You Are Not Logged In"
      visible={ this.state.popUpVisible }
      closable={ true }
      onCancel={ () => this.handleCancel() }
      footer={ [
        <Button
          className="sign-up-button"
          key="sign-up"
          onClick={ () => this.handleSignUp() }
        >
          Sign Up
        </Button>,
        <Button
          className="sign-in-button"
          key="sign-in"
          type="primary"
          onClick={ () => this.handleSignIn() }
        >
          Sign In
        </Button>,
      ] }
    >
      <p>Are you a member of our service?</p>
    </Modal>;
  }


  render() {
    return (
      <div className="main-page">
        <Space className="main-image-wrapper" justify="center" size={ 30 }>
          { this.mainImage(normalHoverImg, normalImg, 1) }
          { this.mainImage(specialHoverImg, specialImg, 2) }
          { this.mainImage(manicHoverImg, manicImg, 3) }
        </Space>
        <Text className="big-text"> Exit Your Routine </Text>
        <Text className="middle-text"> We will bring you the never experienced </Text>
        <Text className="input-prefix"> For </Text>
        { this.inputNumber() }
        { this.modal() }
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
    onGetPlan: (level, headCount, lat, long) => {
      dispatch(actionCreators.getPlan(level, headCount, lat, long));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainPage));
