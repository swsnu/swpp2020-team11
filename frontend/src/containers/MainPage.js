import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Typography, InputNumber, Row, Col } from 'antd';
import normalImg from '../assets/img/normal_trip_main.png';
import specialImg from '../assets/img/special_trip_main.png';
import manicImg from '../assets/img/maniac_trip_main.png';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
const { Paragraph } = Typography;

class Main extends Component {
  state = {
    headCount: 2,
  }

  render() {
    return (
      <div className="MainPage">
        <Row justify="center">
          <Col span={ 4 }>
            <img
              src={ normalImg }
              className="MainImage"
              onClick={ () => this.props.onGetPlan(0, this.state.headCount) }
            />
          </Col>
          <Col span={ 4 }><img src={ specialImg }/></Col>
          <Col span={ 4 }><img src={ manicImg }/></Col>
        </Row>

        <Paragraph>Exit Your Routine</Paragraph>
        <Paragraph>We bring you the never experienced</Paragraph>
        <Paragraph>For </Paragraph>
        <InputNumber
          min={ 1 }
          max={ 10 }
          defaultValue={ 2 }
          onChange={(e) => this.setState({ headCount: e }) }/>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetPlan: (level, headCount) => dispatch(actionCreators.getPlan(level, headCount)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Main));
