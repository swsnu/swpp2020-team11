import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Image, Button, Typography } from 'antd';
import './PlanReservation.css';
import { connect } from 'react-redux';

const { Paragraph } = Typography;

import moment from 'moment';
import { Marker, StaticGoogleMap } from 'react-static-google-map';

class PlanReservation extends Component {
  state = {
    time: 0,
  };

  render() {
    const arrivalTime = moment(this.props.taxi.arrivalTime);
    const waitTime = arrivalTime.diff(moment(), 'minutes');
    return (
      <div className="PlanReservation">
        <Image
          preview={ false }
          src={ this.props.taxi.taxiImage }
          className="TaxiImage"
        />
        <div className="GoogleAPI">
          <StaticGoogleMap size="320x320" zoom="11"
            apiKey={ process.env.REACT_APP_API_KEY }>
            <Marker.Group label="T" color="red">
              <Marker location={ this.props.taxi.arrivalLocation }/>
            </Marker.Group>
          </StaticGoogleMap>
        </div>
        <div className="TaxiInfo">
          <Paragraph>{ this.props.taxi.taxiType }</Paragraph>
          <Paragraph>{ this.props.taxi.carNumber }</Paragraph>
          <Paragraph>{ this.props.taxi.phoneNumber } </Paragraph>
          <Paragraph>{ waitTime } 분 뒤 도착 예정입니다. </Paragraph>
        </div>
        <Button className="ToMainPanel"
          onClick={ () => this.props.history.push('/') }
        >
          메인 화면으로 돌아가기
        </Button>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    taxi: state.plan.reservation.taxi,
  };
};

export default connect(mapStateToProps, null)(withRouter(PlanReservation));
