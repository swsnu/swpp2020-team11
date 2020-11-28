import React from 'react';
// import { Map, GoogleApiWrapper as googleApiWrapper, Marker } from 'google-maps-react';
import { StaticGoogleMap, Marker } from 'react-static-google-map';
import { Button, Rate, Space, Typography, Tag } from 'antd';
import { withRouter } from 'react-router-dom';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const { Text } = Typography;
class HistoryItem extends React.Component {
  onClickModifyHandler(reviewId) {
    this.props.history.push('/review/'+reviewId+'/edit');
  }
  onClickCreateHandler(planId) {
    this.props.history.push('/review/'+planId+'/create');
  }
  render() {
    const place = this.props.place[0];
    const place2 = this.props.place[1];
    const place3 = this.props.place[2];
    const review = this.props.review.filter((review) => review.place==place.id);
    const review2 = this.props.review.filter((review) => review.place==place2.id);
    const review3 = this.props.review.filter((review) => review.place==place3.id);
    const date = this.props.date.split('-');
    let historyReview;
    if (review.length != 0 &&
        review2.length != 0 &&
        review3.length != 0) {
      let score = review[0].score+review2[0].score+review3[0].score;
      score = parseInt(score/3*2)/2;
      historyReview = (
        <div>
          <Rate
            tooltips={desc}
            allowHalf
            value={score}
          >
          </Rate>
          <br/>
          <div className='ant-rate-text'>
            {score ? desc[parseInt(score-0.5)] : desc[0]}
          </div>
          <br/>
          <Button type='primary' onClick={()=>this.onClickModifyHandler(review[0].id)}>
            modify
          </Button>
        </div>
      );
    } else {
      historyReview = <Button className='reviewButton' type='primary'
        onClick={() => this.onClickCreateHandler(this.props.plan)}>review</Button>;
    }
    return (
      <div className = "history_item">
        <Space align="center" direction='horizontal' size='middle'>
          <StaticGoogleMap size="300x300" apiKey={process.env.REACT_APP_API_KEY}>
            <Marker.Group label="T" color="red">
              <Marker location={place} />
              <Marker location={place2} />
              <Marker location={place3} />
            </Marker.Group>
          </StaticGoogleMap>
          <Space direction="vertical">
            <Text>{date[0]+'년 '+date[1]+'월 '+date[2]+'일'}</Text>
            <Space direction="horizontal">
              <Tag color='pink'>#{place.tag}</Tag>
              <Tag color='pink'>#{place2.tag}</Tag>
              <Tag color='pink'>#{place3.tag}</Tag>
            </Space>
            {historyReview}
          </Space>
        </Space>
      </div>
    );
  }
}

export default withRouter(HistoryItem);
