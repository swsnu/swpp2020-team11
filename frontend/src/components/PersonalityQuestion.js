import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Radio, Typography, Space, Divider } from 'antd';
import './PersonalityQuestion.css';
import * as actionCreators from '../store/actions';
import { connect } from 'react-redux';

const { Text, Paragraph } = Typography;


class PersonalityQuestion extends Component {
  onChange(event) {
    this.setState({ value: event.target.value });
    this.props.onSetAnswer(this.props.idx, event.target.value);
  }

  render() {
    return (
      <div className="question-item">
        <Divider/>
        <Paragraph className="question-text">{ this.props.question }</Paragraph>
        <Space justify="center" size={ 30 }>
          <Text className="side-text">매우 동의하지 않는다.</Text>
          <Radio.Group value={this.props.answer[this.props.idx]}
            onChange={ (e) => this.onChange(e) }>
            <Space justify="center" size={ 50 }>
              <Radio.Button className="outer-most-answer-button" value={1}/>
              <Radio.Button className="pinched-answer-button" value={2}/>
              <Radio.Button className="center-answer-button" value={3}/>
              <Radio.Button className="pinched-answer-button" value={4}/>
              <Radio.Button className="outer-most-answer-button" value={5}/>
            </Space>
          </Radio.Group>
          <Text className="side-text">매우 동의한다.</Text>
        </Space>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    answer: state.account.personalityAnswer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAnswer: (idx, value) => dispatch(actionCreators.setPersonality(idx, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PersonalityQuestion));
