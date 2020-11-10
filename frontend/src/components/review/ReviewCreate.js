import React from 'react';
import { Steps, Rate, Input, Space, Button, Tag } from 'antd';
import './ReviewCreate.css';
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
    this.setState({ ...this.state, current: current });
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
  onClickCreate(places, plan) {
    const place = places.map((place, index) => {
      return {
        'plan': plan,
        'place': place.id,
        'score': this.state.score[index],
        'content': this.state.comment[index] };
    });
    this.props.onCreateReview({ 'review': place });
  }
  onClickBack() {
    this.props.history.push('/plan/history');
  }
  render() {
    if (!this.props.isLoggedIn) {
      this.props.history.push('/sign_in');
    }
    if (this.props.histories.length != 0) {
      const { Step } = Steps;
      const { TextArea } = Input;
      let score = this.state.score;
      let comment = this.state.comment;
      const validCreate = score.includes(-1) || comment.includes('');
      score = score[this.state.current];
      comment = comment[this.state.current];
      const plan = parseInt(this.props.match.params.id);
      const plans = this.props.histories.filter((history) => {
        return history.id==plan;
      });
      const place = plans[0].place[this.state.current];
      return (
        <div className='reviewCreate'>
          <Steps current={this.state.current}
            onChange={(current) => this.onChangeCurrent(current)}>
            <Step title='Place 1'/>
            <Step title='Place 2'/>
            <Step title='Place 3'/>
          </Steps>
          <br/>
          <Space direction="vertical">
            <img src={place.img_urls} height='400' width='400'></img>
            <h2>{place.name} <Tag color='pink'> #{place.tag} </Tag></h2>
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
            <Button id='createButton' type="primary" disabled={validCreate}
              onClick={() => this.onClickCreate(plans[0].place, plan)}>
                Create
            </Button>
            <Button id='backButton' type="primary" onClick={() => this.onClickBack()}>
                Back
            </Button>
          </Space>
        </div>
      );
    } else {
      return (<div className='empty'></div>);
    }
  };
}

const mapStateToProps = (state) => {
  return {
    histories: state.plan.history,
    isLoggedIn: state.account.isLoggedIn,
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
