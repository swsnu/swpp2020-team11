import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { Button, Space, Image, Typography } from 'antd';
import './PlanPage.css';
const { Text } = Typography;

class PlanPage extends Component {
  state = {
    headCount: 2,
    popUpVisible: false,
  }

  render() {
    console.log(this.props.plan);
    const images = this.props.plan.imageUrls.map((url, idx) => (
      <Image
        key={ 'place-image-' + idx.toString() }
        width={ 400 }
        height={ 300 }
        preview={ false }
        src={ url }
      />),
    );
    const hashTags = this.props.plan.hashTags.map((tag, idx) => (
      <><Text key={ 'hash-tag-' + idx.toString() }>{ '# ' + tag }</Text><br/></>),
    );

    const information = <>
      <Text>총 인원: { this.props.plan.information.headCount }명</Text>
      <br/>
      <Text>예상 비용: { this.props.plan.information.expectedBudget }원</Text>
      <br/>
      <Text>예상 귀가 시간: { this.props.plan.information.endTime }</Text>
      <br/>
      <Text>예상 이동 거리: { this.props.plan.information.travelDistance / 1000 }Km</Text>
    </>;
    return (
      <div className="plan-page">
        <Space className="main-image-wrapper" justify="center" size={ 10 }>
          { images }
        </Space>
        <div className="hash-tag-wrapper">
          { hashTags }
        </div>
        <div className="information-wrapper">
          { information }
        </div>
        <div className="tempting-phrase-wrapper">
          <Text className="tempting-phrase">
            Do you want to go?
          </Text>
        </div>

        <Button className="reservation-button" type="primary"> 예약하기 </Button>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.account.isLoggedIn,
    plan: state.plan.plan,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetPlan: (level, headCount) => dispatch(actionCreators.getPlan(level, headCount)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlanPage));
