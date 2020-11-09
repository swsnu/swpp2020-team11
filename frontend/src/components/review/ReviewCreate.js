import React from 'react';
import { Steps, Rate, Input, Space, Button } from 'antd';
import './ReviewCreate.css';
import tripImg from '../../assets/img/porto1.png';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router-dom';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
class ReviewCreate extends React.Component {
  state = {
    score: [-1, -1, -1],
    current: 0,
    comment: ['', '', ''],
  };
  componentDidMount() {
    this.props.onGetHistory();
  }
  onChangeCurrent(current) {
    for (let i=0; i<current; i++) {
      if (this.state.score[i] == -1 || this.state.comment[i]=='') {
        alert('please fill the review for place '+(i+1));
        return;
      }
    }
    const stateScore = this.state.score;
    const comment = this.state.comment;
    if (this.state.score.length<current+1) {
      stateScore[this.state.current+1] = -1;
      comment[this.state.current+1] = '';
    }
    this.setState({ ...this.state, current: current,
      score: stateScore, comment: comment });
  }
  onChangeScore(value) {
    const stateScore = this.state.score;
    stateScore[this.state.current] = value;
    this.setState({ ...this.state, score: stateScore });
  }
  onChangeComment(event) {
    const comment = this.state.comment;
    comment[this.state.current] = event.target.value;
    this.setState({ ...this.state, comment: comment });
  }
  onClickCreate(places) {
    const place = places.map((place, index) => {
      return { 'place': place.id,
        'score': this.state.score[index],
        'content': this.state.comment[index] };
    });
    this.props.onCreateReview({ 'review': place });
  }
  onClickBack() {
    this.props.history.push('/plan/history');
  }
  render() {
    if (this.props.histories.length != 0) {
      const { Step } = Steps;
      const { TextArea } = Input;
      let score = this.state.score;
      let comment = this.state.comment;
      const validCreate = score.includes(-1) || comment.includes('') || comment.length <3;
      score = score[this.state.current];
      comment = comment[this.state.current];
      const plan = parseInt(this.props.match.params.id);
      const plans = this.props.histories.filter((history) => {
        return history.id==plan;
      });
      const place = plans[0].place[this.state.current].name;
      return (
        <div className='step'>
          <Steps current={this.state.current}
            onChange={(current) => this.onChangeCurrent(current)}>
            <Step title='Place 1'/>
            <Step title='Place 2'/>
            <Step title='Place 3'/>
          </Steps>
          <br/>
          <Space direction="vertical">
            <img src={tripImg} height='400' width='400'></img>
            <h2>{place}</h2>
            <Rate
              tooltips={desc}
              allowHalf
              value={score}
              onChange={(value) => this.onChangeScore(value)}
            >
            </Rate>
            <div className="ant-rate-text">
              {score ? desc[parseInt(score-0.5)] : desc[0]}
            </div>
            <TextArea style={{ width: 400 }} rows={4} placeholder="Simple Comment"
              value={comment} onChange={(event) => this.onChangeComment(event)}/>
            <Button type="primary" disabled={validCreate}
              onClick={() => this.onClickCreate(plans[0].place)}>
                Create
            </Button>
            <Button type="primary" onClick={() => this.onClickBack()}>
                Back
            </Button>
          </Space>
        </div>
      );
    } else {
      return (<div></div>);
    }
  };
}

const mapStateToProps = (state) => {
  return {
    histories: state.plan.history,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetHistory: () =>
      dispatch(actionCreators.getHistory()),
    onCreateReview: (review) =>
      dispatch(actionCreators.createReview(review)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReviewCreate));
