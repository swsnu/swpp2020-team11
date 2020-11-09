import React from 'react';
import { Steps, Rate, Input, Space, Button } from 'antd';
import './ReviewCreate.css';
import tripImg from '../../assets/img/porto1.png';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router-dom';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
class ReviewEdit extends React.Component {
  state = {
    score: -1,
    current: 0,
    comment: '',
    save: true,
  };
  componentDidMount() {
    this.props.onGetReviewDetail(this.props.match.params.id)
      .then((res) => {
        let i;
        for (i=0; i<3; i++) {
          if (res[i].id==this.props.match.params.id) {
            break;
          }
        }
        this.setState({ ...this.state, score: res[i].score,
          comment: res[i].content, current: i });
      });
  }
  onChangeCurrent(current, review) {
    if (!this.state.save) {
      const result = window.confirm('The change will be lost.');
      if (!result) {
        return;
      }
    }
    const nextReview = this.props.reviewDetail[current];
    this.props.history.push('/review/'+nextReview.id+'/edit');
    this.setState({ ...this.state, score: nextReview.score,
      comment: nextReview.content, current: current, save: true });
  }
  onChangeScore(value) {
    const stateScore = value;
    this.setState({ ...this.state, score: stateScore, save: false });
  }
  onChangeComment(event) {
    const comment = event.target.value;
    this.setState({ ...this.state, comment: comment, save: false });
  }
  onClickModify(review) {
    this.setState({ ...this.state, save: true });
    const modifyReview={ 'id': review.id,
      'score': this.state.score,
      'content': this.state.comment,
    };
    this.props.onModifyReview(modifyReview);
  }
  onClickBack() {
    this.props.history.push('/plan/history');
  }
  render() {
    if (this.props.reviewDetail.length != 0) {
      const { Step } = Steps;
      const { TextArea } = Input;
      const score = this.state.score;
      const comment = this.state.comment;
      const validModify = (comment=='');
      const review = this.props.reviewDetail.filter((review)=>
        review.id==this.props.match.params.id)[0];
      // const place = plans[0].place[this.state.current].name;
      return (
        <div className='step'>
          <Steps current={this.state.current}
            onChange={(current) => this.onChangeCurrent(current, review)}>
            <Step title='Place 1'/>
            <Step title='Place 2'/>
            <Step title='Place 3'/>
          </Steps>
          <br/>
          <Space direction="vertical">
            <img src={tripImg} height='400' width='400'></img>
            {/* <h2>{place}</h2> */}
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
            <Button type="primary" disabled={validModify}
              onClick={() => this.onClickModify(review)}>
                Save
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
    reviewDetail: state.plan.reviewDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetHistory: () =>
      dispatch(actionCreators.getHistory()),
    onGetReviewDetail: (id) =>
      dispatch(actionCreators.getReviewDetail(id)),
    onModifyReview: (review) =>
      dispatch(actionCreators.modifyReview(review)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReviewEdit));
