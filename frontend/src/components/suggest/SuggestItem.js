import React from 'react';
import { withRouter } from 'react-router-dom';
import { Space, Typography, Tag, Rate, Button, Row, Col } from 'antd';
import { Marker, StaticGoogleMap } from 'react-static-google-map';
import './SuggestItem.css';
import * as actionCreators from '../../store/actions';
import { connect } from 'react-redux';

const { Text } = Typography;

class SuggestItem extends React.Component {
  tagColor = [undefined, 'gray', 'red', 'green'];
  tagContent = [undefined, '승인대기중', '거부', '승인'];

  render() {
    const tags = this.props.suggest.hashTags.map((tag, index) => {
      return <Tag key={ index } color='pink'>#{ tag }</Tag>;
    });

    return (
      <div className='suggestItem'>
        <Row align='top' justify='center'>
          <Col xs={ { span: '300px' } }>
            <StaticGoogleMap size="300x300" apiKey={ process.env.REACT_APP_API_KEY }>
              <Marker.Group label='T' color='red'>
                <Marker location={ this.props.suggest.place }/>
              </Marker.Group>
            </StaticGoogleMap>
          </Col>
          <Col xs={ { span: 4 } }>
            <Space className="contentsGrid" align="start" direction="vertical">
              <Space align="center" direction="horizontal">
                <Text className="suggestName">{ this.props.suggest.place.name }</Text>
                <Tag className="statusTag" color={ this.tagColor[this.props.suggest.status] }>
                  { this.tagContent[this.props.suggest.status] }
                </Tag>
              </Space>
              <Space direction="horizontal">
                { tags }
              </Space>
              { this.props.suggest.status === 3 ?
                <Space align="center" direction="horizontal">
                  <Rate
                    disabled
                    allowHalf
                    value={ this.props.suggest.place.score }
                  />
                  <Text className="score">
                    { this.props.suggest.place.score }
                  </Text>
                </Space> :
                <Button
                  className="modifyButton"
                  onClick={ () => this.props.onGetSuggestDetail(this.props.suggest.id) }>
                  수정하기
                </Button>
              }


            </Space>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetSuggestDetail: (id) =>
      dispatch(actionCreators.getSuggestDetail(id)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(SuggestItem));
