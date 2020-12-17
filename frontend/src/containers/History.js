import React, { Component } from 'react';
import HistoryItem from '../components/history/HistoryItem';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { withRouter } from 'react-router-dom';
import { Pagination } from 'antd';
import './History.css';
import historyEmptyImg from '../assets/img/history_empty_suggest.jpg';
import { Image, Typography, Button } from 'antd';
const { Paragraph } = Typography;


class History extends Component {
  state = {
    page: 1,
  }
  componentDidMount() {
    this.props.onGetHistory();
    this.props.onGetReview();
  }

  onPageHandler(pageNumber) {
    this.setState({ ...this.state, page: pageNumber });
  }

  render() {
    if (this.props.histories.length != 0) {
      let historyitem = this.props.histories.map((history) => {
        const placeId = history.place.map((place) => place.id);
        const review = this.props.reviews.filter((review) =>
          placeId.includes(review.place));
        return (
          <div key={history.id}>
            <HistoryItem plan={history.id} place={history.place}
              date={history.date} review={review}/>
            <br/>
          </div>
        );
      });
      historyitem = historyitem.slice(3*(this.state.page-1), 3*(this.state.page-1)+3);
      return (
        <div className='history'>
          <h2>History</h2>
          { historyitem }
          <Pagination
            total={this.props.histories.length}
            defaultPageSize={3}
            onChange={(pageNumber)=>this.onPageHandler(pageNumber)}
          />
        </div>
      );
    } else {
      return (
        <div id = 'historyEmpty' className='empty'>
          <Image
            preview = { false }
            src = { historyEmptyImg }
            className = "historyEmptyImg"
          />
          <div id = "historyEmptyText" >
            <Paragraph>
            You don&#39;t have travel history! <br></br>
            Take a trip with ASAP GO today!
            </Paragraph>
          </div>
          <Button id = "historyToMain" className="historyToMain"
            onClick={ () => this.props.history.push('/') }
          >
          Return to the Main Page
          </Button>
        </div>);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    histories: state.plan.history,
    reviews: state.plan.review,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetHistory: () =>
      dispatch(actionCreators.getHistory()),
    onGetReview: () =>
      dispatch(actionCreators.getReview()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(History));
