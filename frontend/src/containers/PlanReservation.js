import React, { Component } from 'react';
import taxiImg from '../assets/img/reservationInfo_taxi1.png';
import { withRouter } from 'react-router';
import { Typography } from 'antd';
import './PlanReservation.css';
import { connect } from 'react-redux';
const { Paragraph } = Typography;

// import moment from 'moment';

class PlanReservation extends Component {
  // let [time, setTime] = useState(moment.duration(0));

  render() {
    return (
      <div className = "PlanReservation">
        <img
          src={ taxiImg }
          className="TaxiImage"
        />
        <div className="GoogleAPI">
          <Paragraph>구글맵!!!</Paragraph>
        </div>
        <div className="TaxiInfo">
          <Paragraph>개인 택시</Paragraph>
          <Paragraph>서23울 3175</Paragraph>
          <Paragraph>010-5882-5467 </Paragraph>
          <Paragraph>3분 뒤 도착 예정입니다. </Paragraph>
        </div>
        <div className="ToMainPanel"
          onClick={ () => this.props.history.push('/') }
        >
          <Paragraph>메인 화면으로 돌아가기</Paragraph>
        </div>
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

export default connect(mapStateToProps, null)(withRouter(PlanReservation));
